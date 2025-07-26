import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  Share,
  AddToHomeScreen,
  Phone,
  CheckCircle,
} from '@mui/icons-material';

interface iOSPWAGuideProps {
  open?: boolean;
  onClose?: () => void;
}

const IOSPWAGuide: React.FC<iOSPWAGuideProps> = ({ open: controlledOpen, onClose }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;

  useEffect(() => {
    // ตรวจจับ iOS Safari และแสดงคำแนะนำ
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasShownGuide = localStorage.getItem('ios-pwa-guide-shown');

    // แสดงเฉพาะ iOS Safari ที่ยังไม่ได้ติดตั้ง และยังไม่เคยแสดงคำแนะนำ
    if (isIOS && isSafari && !isStandalone && !hasShownGuide && controlledOpen === undefined) {
      // รอ 3 วินาทีหลังโหลดเสร็จ
      const timer = setTimeout(() => {
        setLocalOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [controlledOpen]);

  const handleClose = () => {
    setLocalOpen(false);
    localStorage.setItem('ios-pwa-guide-shown', 'true');
    onClose?.();
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = [
    {
      label: 'เปิดเมนูแชร์',
      icon: <Share />,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            แตะปุ่ม <strong>"แชร์"</strong> ที่ด้านล่างของ Safari
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: '12px',
          }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'primary.main',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <Share sx={{ fontSize: 30 }} />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            💡 หากไม่เห็นปุ่ม ลองเลื่อนขึ้นด้านบนเล็กน้อย
          </Typography>
        </Box>
      ),
    },
    {
      label: 'เลือก "เพิ่มที่หน้าจอหลัก"',
      icon: <AddToHomeScreen />,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            เลื่อนลงหาและแตะ <strong>"เพิ่มที่หน้าจอหลัก"</strong>
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: '12px',
          }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'success.main',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <AddToHomeScreen sx={{ fontSize: 30 }} />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            🔍 หากไม่เห็น ให้เลื่อนในเมนูหา "เพิ่มที่หน้าจอหลัก"
          </Typography>
        </Box>
      ),
    },
    {
      label: 'กดเพิ่ม',
      icon: <CheckCircle />,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            กดปุ่ม <strong>"เพิ่ม"</strong> เพื่อติดตั้งแอปบนหน้าจอหลัก
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: '12px',
          }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'warning.main',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <CheckCircle sx={{ fontSize: 30 }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ 
            p: 2, 
            bgcolor: 'success.light', 
            color: 'success.contrastText',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            🎉 เสร็จแล้ว! ตอนนี้คุณสามารถเปิด BN Sound System จากหน้าจอหลักได้เลย
          </Typography>
        </Box>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : '20px',
          m: isMobile ? 0 : 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Phone sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ติดตั้งแอปบน iPhone
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          เพื่อประสบการณ์การใช้งานที่ดีที่สุด แนะนำให้ติดตั้ง BN Sound System เป็นแอปบนหน้าจอหลัก
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">ขั้นตอนสุดท้าย</Typography>
                  ) : null
                }
                icon={step.icon}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.content}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {index < steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      ขั้นตอนถัดไป
                    </Button>
                  )}
                  {index > 0 && (
                    <Button 
                      onClick={handleBack}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      ย้อนกลับ
                    </Button>
                  )}
                  {index === steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleClose}
                      size="small"
                      color="success"
                      sx={{ textTransform: 'none' }}
                    >
                      เสร็จสิ้น
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* ข้อมูลเพิ่มเติม */}
        <Paper sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'info.light', 
          color: 'info.contrastText',
          borderRadius: '12px',
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            💡 ข้อดีของการติดตั้งแอป:
          </Typography>
          <Typography variant="body2" component="div">
            • 🚀 เปิดได้เร็วขึ้น<br/>
            • 📱 ใช้งานเหมือนแอปจริง<br/>
            • 🌐 ใช้งานได้แม้ไม่มีเน็ต<br/>
            • 🔔 รับการแจ้งเตือน (อนาคต)
          </Typography>
        </Paper>

        {/* ปุ่มข้าม */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            onClick={handleClose}
            variant="text"
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            ข้ามไปก่อน (ใช้งานในเบราว์เซอร์)
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IOSPWAGuide; 