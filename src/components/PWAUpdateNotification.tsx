import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  Refresh,
  Update,
  Close,
} from '@mui/icons-material';

interface PWAUpdateNotificationProps {
  onUpdate?: () => void;
}

const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({ onUpdate }) => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      setWaitingWorker(registration.waiting);
      setShowUpdatePrompt(true);
    };

    // Listen for the service worker update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                handleServiceWorkerUpdate(registration);
              }
            });
          }
        });
      });
    }

    // Listen for messages from service worker
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') {
        setShowUpdatePrompt(true);
      }
    });

    return () => {
      // Cleanup listeners
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', () => {
        if (waitingWorker.state === 'activated') {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
    setShowUpdatePrompt(false);
    onUpdate?.();
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    // Remember user dismissed this update
    sessionStorage.setItem('pwa-update-dismissed', Date.now().toString());
  };

  // Don't show if user recently dismissed
  const recentlyDismissed = sessionStorage.getItem('pwa-update-dismissed');
  if (recentlyDismissed && Date.now() - parseInt(recentlyDismissed) < 60000) { // 1 minute
    return null;
  }

  return (
    <Snackbar
      open={showUpdatePrompt}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: { xs: 80, md: 84 }, // Below navbar
        '& .MuiSnackbarContent-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: 0,
        }
      }}
    >
      <Alert
        severity="info"
        icon={<Update />}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdate}
              startIcon={<Refresh />}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              อัปเดต
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleDismiss}
              sx={{
                minWidth: 'auto',
                p: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Close fontSize="small" />
            </Button>
          </Box>
        }
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '320px',
          maxWidth: '400px',
          '& .MuiAlert-icon': {
            color: 'white',
          },
          '& .MuiAlert-message': {
            flex: 1,
          },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          🎉 เวอร์ชันใหม่พร้อมใช้งาน!
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          อัปเดทเพื่อรับฟีเจอร์ใหม่และการปรับปรุง
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdateNotification; 