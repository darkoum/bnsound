import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Queue as QueueIcon,
  MusicNote,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import PWAInstall from './PWAInstall';
import PWAUpdateNotification from './PWAUpdateNotification';
import IOSPWAGuide from './iOSPWAGuide';

const drawerWidth = 280;
const collapsedWidth = 80;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'แดชบอร์ด', icon: <DashboardIcon />, path: '/', color: '#6366f1' },
    { text: 'ระบบจองคิว', icon: <QueueIcon />, path: '/booking', color: '#ec4899' },
  ];

  const toggleDrawer = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const drawerContent = (
    <>
      {/* Sidebar Header */}
      <Box sx={{ 
        height: { xs: 64, md: 68 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: (isMobile || isDrawerOpen) ? 'space-between' : 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        px: (isMobile || isDrawerOpen) ? { xs: 2.5, md: 2.5 } : 1,
        transition: 'padding 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        },
      }}>
        {(isMobile || isDrawerOpen) ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 1.8 }, zIndex: 1 }}>
              <Avatar
                sx={{
                  width: { xs: 36, md: 34 },
                  height: { xs: 36, md: 34 },
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', md: '0.85rem' },
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                }}
              >
                BN
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: { xs: '0.95rem', md: '0.9rem' },
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}>
                  Admin Panel
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.85)', 
                  fontSize: { xs: '0.72rem', md: '0.7rem' },
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  lineHeight: 1,
                }}>
                  Sound System
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                color: 'white',
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                p: { xs: 1.2, md: 1.3 },
                width: { xs: 36, md: 38 },
                height: { xs: 36, md: 38 },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.18)',
                }
              }}
            >
              <ChevronLeft sx={{ fontSize: { xs: 20, md: 18 } }} />
            </IconButton>
          </>
        ) : (
          <Tooltip title="ขยายเมนู" placement="right">
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                color: 'white',
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                p: 1.3,
                width: 38,
                height: 38,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.18)',
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {/* Menu Section */}
      <Box sx={{ 
        overflow: 'auto',
        padding: (isMobile || isDrawerOpen) ? { xs: '24px 20px', md: '20px 16px' } : '20px 8px',
        height: { xs: 'calc(100vh - 70px)', md: 'calc(100vh - 72px)' },
        background: 'transparent',
        transition: 'padding 0.3s ease',
      }}>
        {(isMobile || isDrawerOpen) && (
          <Typography variant="overline" sx={{ 
            fontSize: { xs: '0.75rem', md: '0.7rem' },
            fontWeight: 800,
            color: '#94a3b8',
            letterSpacing: '0.15em',
            px: 1,
            mb: { xs: 3, md: 2 },
            display: 'block',
            textTransform: 'uppercase',
          }}>
            เมนูหลัก
          </Typography>
        )}
        
        <List sx={{ padding: 0 }}>
          {menuItems.map((item, index) => (
            <Tooltip 
              key={item.text} 
              title={(!isMobile && !isDrawerOpen) ? item.text : ''} 
              placement="right"
            >
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  handleDrawerClose();
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: { xs: '20px', md: '16px' },
                  margin: { xs: '10px 0', md: '6px 0' },
                  padding: (isMobile || isDrawerOpen) ? { xs: '16px 20px', md: '12px 16px' } : '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  justifyContent: (isMobile || isDrawerOpen) ? 'flex-start' : 'center',
                  minHeight: { xs: 56, md: 48 },
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${item.color}25, ${item.color}15)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 30px ${item.color}25, 0 6px 20px rgba(0, 0, 0, 0.1)`,
                    background: 'rgba(255, 255, 255, 0.85)',
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                    borderLeft: `5px solid ${item.color}`,
                    boxShadow: `0 8px 25px ${item.color}35, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                    transform: 'translateX(6px)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${item.color}25, ${item.color}15)`,
                      transform: 'translateY(-3px) translateX(6px)',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? item.color : '#64748b',
                    minWidth: (isMobile || isDrawerOpen) ? { xs: '44px', md: '40px' } : 'auto',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '& svg': {
                      fontSize: { xs: 26, md: 22 },
                      filter: location.pathname === item.path ? `drop-shadow(0 3px 6px ${item.color}50)` : 'none',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(isMobile || isDrawerOpen) && (
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 800 : 600,
                        color: location.pathname === item.path ? item.color : '#475569',
                        fontSize: { xs: '1rem', md: '0.9rem' },
                        transition: 'all 0.3s ease',
                        textShadow: location.pathname === item.path ? `0 2px 4px ${item.color}40` : 'none',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>

        {/* Footer Section */}
        {(isMobile || isDrawerOpen) && (
          <Box sx={{ 
            mt: 'auto', 
            pt: { xs: 4, md: 3 },
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center',
          }}>
            <Typography variant="caption" sx={{ 
              color: '#94a3b8',
              fontSize: { xs: '0.75rem', md: '0.7rem' },
              fontWeight: 600,
            }}>
              © 2024 BN Sound System
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          sx={{
            width: isDrawerOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
              width: isDrawerOpen ? drawerWidth : collapsedWidth,
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRight: 'none',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)',
              position: 'relative',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, rgba(236, 72, 153, 0.02) 100%)',
                zIndex: -1,
              },
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRight: 'none',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.15)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, rgba(236, 72, 153, 0.02) 100%)',
                zIndex: -1,
              },
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: isMobile ? '100%' : `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedWidth}px)`,
          transition: 'width 0.3s ease',
          paddingBottom: isMobile ? '64px' : 0, // Space for bottom navigation
        }}
      >
        {/* Top Navigation Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ 
            height: { xs: 64, md: 68 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 75%, #f5576c 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: 'none',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25), 0 1px 8px rgba(245, 87, 108, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)',
              zIndex: 0,
            },
          }}
        >
          <Toolbar sx={{ 
            height: '100%',
            padding: { xs: '0 12px', md: '0 20px' }, 
            justifyContent: 'space-between',
            minHeight: { xs: '64px !important', md: '68px !important' },
            position: 'relative',
            zIndex: 2,
            gap: { xs: 1, md: 1.5 },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    p: { xs: 1.2, md: 1.3 },
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: { xs: 40, md: 42 },
                    height: { xs: 40, md: 42 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.22)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <MenuIcon sx={{ fontSize: { xs: 20, md: 22 }, color: 'white' }} />
                </IconButton>
              )}
              
              {/* Logo Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, md: 1.2 },
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                borderRadius: { xs: '14px', md: '16px' },
                padding: { xs: '4px 8px', md: '6px 12px' },
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.25s ease',
                height: { xs: 40, md: 44 },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.18)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                },
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.75) 100%)',
                  borderRadius: { xs: '10px', md: '12px' },
                  p: { xs: 0.8, md: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  width: { xs: 28, md: 32 },
                  height: { xs: 28, md: 32 },
                }}>
                  <MusicNote sx={{ 
                    color: '#667eea', 
                    fontSize: { xs: 18, md: 20 },
                    filter: 'drop-shadow(0 1px 2px rgba(102, 126, 234, 0.3))',
                  }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    component="div"
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    BN Sound System
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.65rem', md: '0.7rem' },
                    fontWeight: 500,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
                    letterSpacing: '0.01em',
                    opacity: 0.9,
                    lineHeight: 1,
                  }}>
                    ระบบจัดการเสียงครบวงจร
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, md: 1 } }}>
              {/* Notification Button */}
              <IconButton sx={{ 
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                width: { xs: 40, md: 42 },
                height: { xs: 40, md: 42 },
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.22)',
                  transform: 'translateY(-2px) scale(1.02)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                },
              }}>
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                      border: '2px solid white',
                      minWidth: '16px',
                      height: '16px',
                    }
                  }}
                >
                  <Notifications sx={{ 
                    fontSize: { xs: 18, md: 20 },
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
                  }} />
                </Badge>
              </IconButton>
              
              {/* User Profile Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.8, md: 1 },
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: { xs: '14px', md: '16px' },
                padding: { xs: '3px 6px', md: '4px 8px' },
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                height: { xs: 40, md: 44 },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.18)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                },
              }}>
                <Avatar 
                  sx={{ 
                    width: { xs: 32, md: 34 }, 
                    height: { xs: 32, md: 34 }, 
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    color: '#667eea',
                    fontWeight: 700,
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                >
                  AD
                </Avatar>
                <Box sx={{ 
                  display: { xs: 'none', sm: 'block' },
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                    lineHeight: 1.1,
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}>
                    Admin User
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.62rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
                    fontWeight: 500,
                    letterSpacing: '0.005em',
                    lineHeight: 1,
                  }}>
                    ผู้ดูแลระบบ
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ 
          flexGrow: 1,
          bgcolor: 'transparent',
          p: 0,
        }}>
          {children}
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(229, 231, 235, 0.3)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
          }} 
          elevation={0}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={handleBottomNavChange}
            sx={{
              background: 'transparent',
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                color: '#6b7280',
                transition: 'all 0.3s ease',
                borderRadius: '14px',
                margin: '6px 3px',
                minWidth: 'auto',
                '&.Mui-selected': {
                  color: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginTop: '3px',
                },
              },
            }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.text}
                value={item.path}
                icon={React.cloneElement(item.icon, { 
                  sx: { fontSize: 24 } 
                })}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
      
      <PWAInstall />
      <PWAUpdateNotification />
      <IOSPWAGuide />
    </Box>
  );
};

export default Layout; 