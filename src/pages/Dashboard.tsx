import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CalendarMonth,
  DateRange,
  Analytics,
  PendingActions,
  CheckCircle,
  Cancel,
  AccessTime,
  Assignment,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Booking } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load mock data
    import('../utils/mockData').then(({ mockBookings }) => {
      setBookings(mockBookings);
    });
  }, []);

  // Calculate monthly revenue for current year
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
    const monthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.endDate);
      return bookingDate.getMonth() === index && 
             bookingDate.getFullYear() === currentYear &&
             booking.status === 'completed';
    });
    return monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  });

  // Calculate current month revenue
  const currentMonth = new Date().getMonth();
  const currentMonthRevenue = monthlyRevenue[currentMonth];

  // Calculate current year revenue
  const currentYearRevenue = monthlyRevenue.reduce((sum, monthRev) => sum + monthRev, 0);

  // Calculate previous month for comparison
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthRevenue = monthlyRevenue[previousMonth];
  const monthGrowth = previousMonthRevenue > 0 
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : 0;

  // Calculate previous year revenue for comparison
  const previousYearRevenue = bookings.filter(booking => {
    const bookingDate = new Date(booking.endDate);
    return bookingDate.getFullYear() === currentYear - 1 &&
           booking.status === 'completed';
  }).reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  const yearGrowth = previousYearRevenue > 0 
    ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100 
    : 0;

  // Calculate outstanding payments (remaining amounts)
  const currentMonthOutstanding = bookings.filter(booking => {
    const bookingDate = new Date(booking.endDate);
    return bookingDate.getMonth() === currentMonth && 
           bookingDate.getFullYear() === currentYear &&
           booking.remainingAmount > 0;
  }).reduce((sum, booking) => sum + booking.remainingAmount, 0);

  const currentYearOutstanding = bookings.filter(booking => {
    const bookingDate = new Date(booking.endDate);
    return bookingDate.getFullYear() === currentYear &&
           booking.remainingAmount > 0;
  }).reduce((sum, booking) => sum + booking.remainingAmount, 0);

  // Additional booking statistics
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const inProgressBookings = bookings.filter(b => b.status === 'in-progress').length;

  // Current month bookings
  const currentMonthBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startDate);
    return bookingDate.getMonth() === currentMonth && 
           bookingDate.getFullYear() === currentYear;
  });

  // Overdue bookings (past end date but not completed)
  const overdueBookings = bookings.filter(booking => {
    const endDate = new Date(booking.endDate);
    const today = new Date();
    return endDate < today && booking.status !== 'completed' && booking.status !== 'cancelled';
  });

  // Popular services
  const serviceStats = bookings.reduce((acc: any, booking) => {
    const service = booking.serviceName;
    if (!acc[service]) {
      acc[service] = { count: 0, revenue: 0 };
    }
    acc[service].count += 1;
    if (booking.status === 'completed') {
      acc[service].revenue += booking.totalPrice;
    }
    return acc;
  }, {});

  const popularServices = Object.entries(serviceStats)
    .map(([service, stats]: [string, any]) => ({
      service,
      count: stats.count,
      revenue: stats.revenue
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const chartData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    datasets: [
      {
        label: 'รายได้ประจำเดือน',
        data: monthlyRevenue,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: function(context: any) {
            return `รายได้: ฿${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: 500,
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: 500,
          },
          callback: function(value: any) {
            return '฿' + value.toLocaleString();
          }
        },
        border: {
          display: false,
        }
      },
    },
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, transparent 50%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      p: { xs: 2, sm: 2, md: 3, lg: 4 },
    }}>
      {/* Floating Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: { xs: '120px', md: '200px' },
        height: { xs: '120px', md: '200px' },
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
        filter: 'blur(60px)',
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: { xs: '100px', md: '150px' },
        height: { xs: '100px', md: '150px' },
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 4, lg: 6 }, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 900, 
            mb: { xs: 1.5, md: 2 },
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 6px rgba(99, 102, 241, 0.1)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.75rem' },
          }}>
            📊 แดชบอร์ด
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#6b7280',
            fontWeight: 500,
            maxWidth: '600px',
            mx: 'auto',
            opacity: 0.8,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            px: { xs: 1, sm: 0 },
            lineHeight: 1.4,
          }}>
            สรุปรายได้และภาพรวมธุรกิจของ BN Sound System
          </Typography>
        </Box>

        {/* Revenue Summary Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
          gap: { xs: 3, sm: 3, md: 4 },
          mb: { xs: 5, sm: 5, md: 6 },
        }}>
          {/* Monthly Revenue Card */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '24px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '140px', sm: '160px' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 50px rgba(99, 102, 241, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
            },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 2.5, md: 3 } 
              }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: { xs: '16px', md: '16px' },
                  p: { xs: 2, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  minWidth: { xs: '60px', md: 'auto' },
                  minHeight: { xs: '60px', md: 'auto' },
                }}>
                  <CalendarMonth sx={{ color: 'white', fontSize: { xs: 28, md: 28 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: '#1f2937', 
                    mb: 0.5,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                    lineHeight: 1.1,
                  }}>
                    ฿{currentMonthRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}>
                    รายได้เดือนนี้
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {monthGrowth >= 0 ? (
                  <TrendingUp sx={{ fontSize: { xs: 20, md: 20 }, color: '#10b981' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: { xs: 20, md: 20 }, color: '#ef4444' }} />
                )}
                <Typography variant="body2" sx={{ 
                  color: monthGrowth >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', md: '0.875rem' },
                }}>
                  {Math.abs(monthGrowth).toFixed(1)}% จากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Yearly Revenue Card */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '24px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '140px', sm: '160px' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
            },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 2.5, md: 3 } 
              }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: { xs: '16px', md: '16px' },
                  p: { xs: 2, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                  minWidth: { xs: '60px', md: 'auto' },
                  minHeight: { xs: '60px', md: 'auto' },
                }}>
                  <DateRange sx={{ color: 'white', fontSize: { xs: 28, md: 28 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: '#1f2937', 
                    mb: 0.5,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                    lineHeight: 1.1,
                  }}>
                    ฿{currentYearRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}>
                    รายได้ประจำปี {currentYear}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {yearGrowth >= 0 ? (
                  <TrendingUp sx={{ fontSize: { xs: 20, md: 20 }, color: '#10b981' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: { xs: 20, md: 20 }, color: '#ef4444' }} />
                )}
                <Typography variant="body2" sx={{ 
                  color: yearGrowth >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', md: '0.875rem' },
                }}>
                  {Math.abs(yearGrowth).toFixed(1)}% จากปีที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>

{/* Outstanding Payments This Month */}
<Card sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '24px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '140px', sm: '160px' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 50px rgba(239, 68, 68, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
            },
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, md: 3 }, 
                mb: { xs: 2.5, md: 3 } 
              }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: { xs: '16px', md: '16px' },
                  p: { xs: 2, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                  minWidth: { xs: '60px', md: 'auto' },
                  minHeight: { xs: '60px', md: 'auto' },
                }}>
                  <AccessTime sx={{ color: 'white', fontSize: { xs: 28, md: 28 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: '#1f2937', 
                    mb: 0.5,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                    lineHeight: 1.1,
                  }}>
                    ฿{currentMonthOutstanding.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#6b7280', 
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}>
                    ค้างชำระเดือนนี้
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Analytics sx={{ fontSize: { xs: 20, md: 20 }, color: '#f59e0b' }} />
                <Typography variant="body2" sx={{ 
                  color: '#f59e0b',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', md: '0.875rem' },
                }}>
                  ประจำปี: ฿{currentYearOutstanding.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Booking Statistics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(5, 1fr)' 
          },
          gap: { xs: 2.5, sm: 3 },
          mb: { xs: 5, sm: 5, md: 6 },
        }}>
          {[
            { icon: Assignment, title: 'งานทั้งหมด', value: totalBookings, color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.1)' },
            { icon: CheckCircle, title: 'เสร็จสิ้น', value: completedBookings, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
            { icon: PendingActions, title: 'รอดำเนินการ', value: pendingBookings, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
            { icon: AccessTime, title: 'กำลังทำ', value: inProgressBookings, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
            { icon: Cancel, title: 'เกินกำหนด', value: overdueBookings.length, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
          ].map((item, index) => (
            <Card key={index} sx={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: { xs: '18px', md: '20px' },
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: `0 6px 25px ${item.color}25`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: { xs: '120px', sm: '140px' },
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 15px 40px ${item.color}35`,
              },
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ 
                  backgroundColor: item.bgColor,
                  borderRadius: { xs: '14px', md: '16px' },
                  width: { xs: 56, md: 64 },
                  height: { xs: 56, md: 64 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 1.5, md: 2 },
                }}>
                  <item.icon sx={{ color: item.color, fontSize: { xs: 28, md: 32 } }} />
                </Box>
                <Typography variant="h2" sx={{ 
                  fontWeight: 900, 
                  color: '#1f2937', 
                  mb: 0.5,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                  lineHeight: 1,
                }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#6b7280', 
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                  lineHeight: 1.2,
                }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Revenue Chart */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: { xs: '20px', md: '24px' },
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          mb: { xs: 5, sm: 5, md: 6 },
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              mb: { xs: 3, md: 4 },
              gap: { xs: 2, sm: 0 },
            }}>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800, 
                  mb: 1, 
                  color: '#1f2937',
                  fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2.125rem' },
                }}>
                  📈 กราฟเปรียบเทียบรายได้ต่อเดือน
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#6b7280',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 500,
                }}>
                  รายได้จากงานที่เสร็จสิ้นแล้วในปี {currentYear}
                </Typography>
              </Box>
              <FormControl size="small">
                <Select 
                  value={currentYear.toString()} 
                  sx={{ 
                    minWidth: { xs: 100, md: 120 },
                    borderRadius: '14px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    },
                  }}
                >
                  <MenuItem value={currentYear.toString()}>{currentYear}</MenuItem>
                  <MenuItem value={(currentYear - 1).toString()}>{currentYear - 1}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ height: { xs: 280, sm: 320, md: 400 }, position: 'relative' }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
            
            {/* Chart Summary */}
            <Box sx={{ 
              mt: 3, 
              p: { xs: 2.5, md: 3 }, 
              background: 'rgba(99, 102, 241, 0.08)',
              borderRadius: { xs: '16px', md: '16px' },
              border: '1px solid rgba(99, 102, 241, 0.15)',
            }}>
              <Typography variant="body2" sx={{ 
                color: '#6b7280', 
                fontWeight: 600,
                fontSize: { xs: '0.85rem', md: '0.875rem' },
                lineHeight: 1.5,
                textAlign: { xs: 'center', sm: 'left' },
              }}>
                💡 สรุปข้อมูล: รายได้ทั้งปี ฿{currentYearRevenue.toLocaleString()} | 
                งานเสร็จ {completedBookings} งาน | 
                เดือนนี้ ฿{currentMonthRevenue.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Additional Statistics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
          gap: { xs: 4, md: 4 },
        }}>
          {/* Popular Services */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '20px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                mb: 3, 
                color: '#1f2937',
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              }}>
                🎯 บริการยอดนิยม
              </Typography>
              {popularServices.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: { xs: 2, md: 2 },
                  borderBottom: index < popularServices.length - 1 ? '1px solid rgba(229, 231, 235, 0.5)' : 'none'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Typography variant="h6" sx={{ 
                      backgroundColor: index === 0 ? '#6366f1' : '#e5e7eb',
                      color: index === 0 ? 'white' : '#6b7280',
                      borderRadius: '50%',
                      width: { xs: 32, md: 32 },
                      height: { xs: 32, md: 32 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      fontWeight: 800
                    }}>
                      {index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 700, 
                        color: '#1f2937',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}>
                        {item.service}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#6b7280',
                        fontSize: { xs: '0.75rem', md: '0.75rem' },
                        fontWeight: 500,
                      }}>
                        {item.count} งาน
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 800, 
                    color: '#10b981',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  }}>
                    ฿{item.revenue.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* This Month Summary */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '20px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                mb: 3, 
                color: '#1f2937',
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              }}>
                📅 สรุปเดือนนี้
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ p: { xs: 3, md: 3 }, backgroundColor: 'rgba(99, 102, 241, 0.12)', borderRadius: '16px' }}>
                  <Typography variant="body2" sx={{ 
                    color: '#6366f1', 
                    mb: 1, 
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                  }}>
                    งานใหม่เดือนนี้
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#6366f1',
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                  }}>
                    {currentMonthBookings.length} งาน
                  </Typography>
                </Box>
                
                <Box sx={{ p: { xs: 3, md: 3 }, backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: '16px' }}>
                  <Typography variant="body2" sx={{ 
                    color: '#10b981', 
                    mb: 1, 
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                  }}>
                    อัตราความสำเร็จ
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#10b981',
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                  }}>
                    {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
                  </Typography>
                </Box>
                
                <Box sx={{ p: { xs: 3, md: 3 }, backgroundColor: 'rgba(245, 158, 11, 0.12)', borderRadius: '16px' }}>
                  <Typography variant="body2" sx={{ 
                    color: '#f59e0b', 
                    mb: 1, 
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                  }}>
                    รายได้เฉลี่ยต่องาน
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, 
                    color: '#f59e0b',
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.125rem' },
                  }}>
                    ฿{completedBookings > 0 
                      ? Math.round(currentYearRevenue / completedBookings).toLocaleString()
                      : '0'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Top Months */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: '20px', md: '20px' },
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                mb: 3, 
                color: '#1f2937',
                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              }}>
                🏆 เดือนที่มีรายได้สูงสุด
              </Typography>
              {monthlyRevenue
                .map((revenue, index) => ({ revenue, month: index }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((item, index) => (
                  <Box key={item.month} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: { xs: 2, md: 2 },
                    borderBottom: index < 4 ? '1px solid rgba(229, 231, 235, 0.5)' : 'none'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Typography variant="h6" sx={{ 
                        backgroundColor: index === 0 ? '#fbbf24' : '#e5e7eb',
                        color: index === 0 ? 'white' : '#6b7280',
                        borderRadius: '50%',
                        width: { xs: 32, md: 32 },
                        height: { xs: 32, md: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        fontWeight: 800
                      }}>
                        {index + 1}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 700, 
                        color: '#1f2937',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}>
                        {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][item.month]}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 800, 
                      color: '#10b981',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    }}>
                      ฿{item.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 