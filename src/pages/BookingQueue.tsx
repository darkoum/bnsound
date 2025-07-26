import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  InputAdornment,
  Alert,
  AlertTitle,
  Collapse,
  Fab,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Payment,
  Visibility,
  Phone,
  Event,
  MonetizationOn,
  AccessTime,
  CheckCircle,
  Cancel,
  Pending,
  PlayArrow,
  Search,
  FilterList,
  Close,
  CalendarToday,
  Work,
  AttachMoney,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Booking } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

// Mobile Card Component for Booking
const BookingCard: React.FC<{
  booking: Booking;
  onView: () => void;
  onEdit: () => void;
  onPayment: () => void;
  calculateDays: (start: Date, end: Date) => number;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
  getStatusLabel: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
  getPaymentStatusLabel: (status: string) => string;
}> = ({ 
  booking, 
  onView, 
  onEdit, 
  onPayment, 
  calculateDays,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: '16px', 
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.06)',
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
      }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              width: { xs: 40, sm: 48 }, 
              height: { xs: 40, sm: 48 },
              fontSize: { xs: '1rem', sm: '1.2rem' },
            }}>
              {booking.customerName.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '1rem', sm: '1.1rem' },
                mb: 0.5,
                wordBreak: 'break-word',
              }}>
                {booking.customerName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {booking.customerPhone}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(booking.status)}
                label={getStatusLabel(booking.status)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(booking.status),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>

        {/* Service and Date Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Work sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {booking.serviceName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              {booking.startDate.toLocaleDateString('th-TH')} - {booking.endDate.toLocaleDateString('th-TH')}
            </Typography>
            <Chip 
              label={`${calculateDays(booking.startDate, booking.endDate)} วัน`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          </Box>
        </Box>

        {/* Payment Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 2 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              ฿{booking.totalPrice.toLocaleString()}
            </Typography>
          </Box>
          <Chip
            label={getPaymentStatusLabel(booking.paymentStatus)}
            size="small"
            sx={{
              backgroundColor: getPaymentStatusColor(booking.paymentStatus),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          {/* Payment Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              รายละเอียดการชำระเงิน
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">ชำระแล้ว:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                ฿{booking.paidAmount.toLocaleString()}
              </Typography>
            </Box>
            {booking.paymentStatus !== 'paid' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">คงเหลือ:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  ฿{booking.remainingAmount.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Notes */}
          {booking.notes && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                หมายเหตุ
              </Typography>
              <Typography variant="body2" sx={{ 
                p: 1.5, 
                bgcolor: 'grey.50', 
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}>
                {booking.notes}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={onView}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              ดูรายละเอียด
            </Button>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={onEdit}
              color="warning"
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              แก้ไข
            </Button>
            {booking.paymentStatus !== 'paid' && (
              <Button
                size="small"
                startIcon={<Payment />}
                onClick={onPayment}
                color="success"
                variant="contained"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                รับชำระ
              </Button>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const BookingQueue: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterServiceType, setFilterServiceType] = useState('');
  const [showOverdueAlert, setShowOverdueAlert] = useState(true);
  
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerPhone: '',
    serviceName: '',
    startDate: new Date() as Date | null,
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) as Date | null,
    totalPrice: '',
    notes: '',
  });

  useEffect(() => {
    // Load mock data
    import('../utils/mockData').then(({ mockBookings }) => {
      setBookings(mockBookings);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2e7d32';
      case 'pending': return '#ed6c02';
      case 'in-progress': return '#1976d2';
      case 'completed': return '#2e7d32';
      case 'cancelled': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'in-progress': return <PlayArrow />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <AccessTime />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'pending': return 'รอยืนยัน';
      case 'in-progress': return 'กำลังดำเนินงาน';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#2e7d32';
      case 'partial': return '#ed6c02';
      case 'unpaid': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'ชำระครบ';
      case 'partial': return 'ชำระบางส่วน';
      case 'unpaid': return 'ยังไม่ชำระ';
      default: return status;
    }
  };

  const handleAddBooking = () => {
    if (!newBooking.startDate || !newBooking.endDate || !newBooking.totalPrice) return;

    const totalPrice = parseFloat(newBooking.totalPrice) || 0;

    const booking: Booking = {
      id: Date.now().toString(),
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      serviceName: newBooking.serviceName,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      status: 'pending',
      totalPrice,
      paidAmount: 0,
      remainingAmount: totalPrice,
      paymentStatus: 'unpaid',
      notes: newBooking.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBookings([...bookings, booking]);
    setOpen(false);
    setNewBooking({
      customerName: '',
      customerPhone: '',
      serviceName: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      totalPrice: '',
      notes: '',
    });
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus as any, updatedAt: new Date() }
        : booking
    ));
  };

  const handlePayment = () => {
    if (!selectedBooking || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    const newPaidAmount = selectedBooking.paidAmount + amount;
    const newRemainingAmount = selectedBooking.totalPrice - newPaidAmount;
    
    let paymentStatus: 'unpaid' | 'partial' | 'paid' = 'unpaid';
    if (newRemainingAmount <= 0) {
      paymentStatus = 'paid';
    } else if (newPaidAmount > 0) {
      paymentStatus = 'partial';
    }

    setBookings(bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { 
            ...booking, 
            paidAmount: newPaidAmount,
            remainingAmount: Math.max(0, newRemainingAmount),
            paymentStatus,
            updatedAt: new Date(),
          }
        : booking
    ));

    setPaymentOpen(false);
    setPaymentAmount('');
    setSelectedBooking(null);
  };

  // Get unique service types for filter
  const uniqueServiceTypes = Array.from(new Set(bookings.map(booking => booking.serviceName)));
  
  // Get overdue bookings (unpaid after end date)
  const overdueBookings = bookings.filter(booking => 
    booking.paymentStatus !== 'paid' && 
    booking.endDate < new Date() &&
    booking.status !== 'cancelled'
  );

  const filteredBookings = bookings.filter(booking => {
    // Tab filter
    let tabFilter = true;
    switch (tabValue) {
      case 0: tabFilter = true; break; // ทั้งหมด
      case 1: tabFilter = booking.status === 'pending'; break; // รอยืนยัน
      case 2: tabFilter = booking.status === 'confirmed' || booking.status === 'in-progress'; break; // กำลังดำเนินงาน
      case 3: tabFilter = booking.status === 'completed'; break; // เสร็จสิ้น
      case 4: tabFilter = booking.paymentStatus !== 'paid'; break; // รอชำระเงิน
    }

    // Search filter
    const searchFilter = searchText === '' || 
      booking.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.customerPhone.includes(searchText) ||
      booking.serviceName.toLowerCase().includes(searchText.toLowerCase());

    // Date filter
    const dateFilter = (!filterStartDate || booking.startDate >= filterStartDate) &&
      (!filterEndDate || booking.endDate <= filterEndDate);

    // Service type filter
    const serviceFilter = filterServiceType === '' || booking.serviceName === filterServiceType;

    return tabFilter && searchFilter && dateFilter && serviceFilter;
  });

  const clearFilters = () => {
    setSearchText('');
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterServiceType('');
  };

  const calculateDays = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh', 
        p: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 10, md: 4 }, // Extra padding for mobile bottom nav
      }}>
        {/* Header */}
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
              color: '#2d3436', 
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}>
              📋 ระบบจองคิว
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#636e72',
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}>
              จัดการการจองและชำระเงิน
            </Typography>
          </Box>
          
          {/* Desktop Add Button */}
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
            >
              เพิ่มการจองใหม่
            </Button>
          )}
        </Box>

        {/* Mobile FAB */}
        {isMobile && (
          <Fab
            color="primary"
            onClick={() => setOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              zIndex: 1000,
            }}
          >
            <Add />
          </Fab>
        )}

        {/* Overdue Alert */}
        {overdueBookings.length > 0 && showOverdueAlert && (
          <Collapse in={showOverdueAlert}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowOverdueAlert(false)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>แจ้งเตือนค้างชำระ</AlertTitle>
              มีลูกค้า {overdueBookings.length} ราย ที่ค้างชำระเงินเกินกำหนดแล้ว
              <br />
              <Box component="span" sx={{ fontSize: '0.875rem', mt: 1, display: 'block' }}>
                สมมาย โตไฮน - ฿10,000 | สมหญิง ยยนัด - ฿3,000 | สมวัง ตีกกา - ฿8,000 และอีก {Math.max(0, overdueBookings.length - 3)} ราย
              </Box>
            </Alert>
          </Collapse>
        )}

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(5, 1fr)' 
          },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 3, md: 4 },
        }}>
          {[
            { icon: Event, label: 'การจองทั้งหมด', value: bookings.length, color: '#667eea' },
            { icon: Pending, label: 'รอยืนยัน', value: bookings.filter(b => b.status === 'pending').length, color: '#fdcb6e' },
            { icon: CheckCircle, label: 'เสร็จสิ้นแล้ว', value: bookings.filter(b => b.status === 'completed').length, color: '#00b894' },
            { icon: MonetizationOn, label: 'รายได้ที่ได้รับ', value: `฿${bookings.reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}`, color: '#00b894' },
            { icon: AccessTime, label: 'ยอดค้างชำระ', value: `฿${bookings.reduce((sum, b) => sum + b.remainingAmount, 0).toLocaleString()}`, color: '#e17055' },
          ].map((stat, index) => (
            <Card key={index} sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' },
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 1, md: 2 } }}>
                  <stat.icon sx={{ fontSize: { xs: 32, md: 40 }, color: stat.color }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#2d3436', 
                  mb: 1,
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#636e72',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Search and Filter Section */}
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {/* Search Bar */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, หรือประเภทงาน..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Box>

            {/* Filter Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                ตัวกรองเพิ่มเติม
              </Button>
              {(searchText || filterStartDate || filterEndDate || filterServiceType) && (
                <Button 
                  onClick={clearFilters}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  ล้างตัวกรอง
                </Button>
              )}
            </Box>

            {/* Expandable Filters */}
            <Collapse in={showFilters}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 2,
                mt: 2,
              }}>
                <DatePicker
                  label="วันที่เริ่ม (จาก)"
                  value={filterStartDate}
                  onChange={setFilterStartDate}
                  slotProps={{ 
                    textField: { 
                      size: 'small',
                      fullWidth: true,
                    } 
                  }}
                />
                <DatePicker
                  label="วันที่สิ้นสุด (ถึง)"
                  value={filterEndDate}
                  onChange={setFilterEndDate}
                  slotProps={{ 
                    textField: { 
                      size: 'small',
                      fullWidth: true,
                    } 
                  }}
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>ประเภทงาน</InputLabel>
                  <Select
                    value={filterServiceType}
                    label="ประเภทงาน"
                    onChange={(e) => setFilterServiceType(e.target.value)}
                  >
                    <MenuItem value="">ทั้งหมด</MenuItem>
                    {uniqueServiceTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ px: { xs: 2, md: 3 } }}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
            >
              <Tab label={`ทั้งหมด (${bookings.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`รอยืนยัน (${bookings.filter(b => b.status === 'pending').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`กำลังดำเนินงาน (${bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`เสร็จสิ้น (${bookings.filter(b => b.status === 'completed').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`รอชำระเงิน (${bookings.filter(b => b.paymentStatus !== 'paid').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={tabValue}>
            {filteredBookings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
                <Typography variant="h6" sx={{ color: '#636e72', mb: 1 }}>
                  ไม่พบข้อมูล
                </Typography>
                <Typography variant="body2" sx={{ color: '#636e72' }}>
                  ลองปรับเปลี่ยนตัวกรองหรือเพิ่มข้อมูลการจองใหม่
                </Typography>
              </Box>
            ) : (
              <Box>
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => {
                      setSelectedBooking(booking);
                      setViewOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedBooking(booking);
                      setEditOpen(true);
                    }}
                    onPayment={() => {
                      setSelectedBooking(booking);
                      setPaymentOpen(true);
                    }}
                    calculateDays={calculateDays}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getStatusLabel={getStatusLabel}
                    getPaymentStatusColor={getPaymentStatusColor}
                    getPaymentStatusLabel={getPaymentStatusLabel}
                  />
                ))}
              </Box>
            )}
          </TabPanel>
        </Card>

        {/* Add Booking Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
            เพิ่มการจองใหม่
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mt: 2,
            }}>
              <TextField
                fullWidth
                label="ชื่อลูกค้า"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
              />
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                value={newBooking.customerPhone}
                onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
              />
              <TextField
                fullWidth
                label="ประเภทงาน/รายละเอียดงาน"
                value={newBooking.serviceName}
                onChange={(e) => setNewBooking({ ...newBooking, serviceName: e.target.value })}
                placeholder="เช่น งานแต่งงาน, งานเลี้ยงรับรอง, งานคอนเสิร์ต..."
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
              <DatePicker
                label="วันที่เริ่ม"
                value={newBooking.startDate}
                onChange={(date) => setNewBooking({ ...newBooking, startDate: date || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="วันที่สิ้นสุด"
                value={newBooking.endDate}
                onChange={(date) => setNewBooking({ ...newBooking, endDate: date || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TextField
                fullWidth
                label="ราคารวม (บาท)"
                type="number"
                value={newBooking.totalPrice}
                onChange={(e) => setNewBooking({ ...newBooking, totalPrice: e.target.value })}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
              <TextField
                fullWidth
                label="หมายเหตุ"
                multiline
                rows={3}
                value={newBooking.notes}
                onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleAddBooking} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              เพิ่มการจอง
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            รับชำระเงิน
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ mt: 2 }}>
                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {selectedBooking.customerName}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>ยอดรวม:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>฿{selectedBooking.totalPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>ชำระแล้ว:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#00b894' }}>฿{selectedBooking.paidAmount.toLocaleString()}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 600 }}>คงเหลือ:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#e17055' }}>฿{selectedBooking.remainingAmount.toLocaleString()}</Typography>
                  </Box>
                </Paper>
                
                <TextField
                  fullWidth
                  label="จำนวนเงินที่รับชำระ"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPaymentOpen(false)} sx={{ textTransform: 'none' }}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handlePayment} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              บันทึกการชำระ
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Booking Dialog */}
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            รายละเอียดการจอง
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>ข้อมูลลูกค้า</Typography>
                  <Typography>ชื่อ: {selectedBooking.customerName}</Typography>
                  <Typography>เบอร์โทร: {selectedBooking.customerPhone}</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>รายละเอียดงาน</Typography>
                  <Typography>ประเภทงาน: {selectedBooking.serviceName}</Typography>
                  <Typography>วันที่: {selectedBooking.startDate.toLocaleDateString('th-TH')} - {selectedBooking.endDate.toLocaleDateString('th-TH')}</Typography>
                  <Typography>จำนวนวัน: {calculateDays(selectedBooking.startDate, selectedBooking.endDate)} วัน</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>ข้อมูลการชำระเงิน</Typography>
                  <Typography>ราคารวม: ฿{selectedBooking.totalPrice.toLocaleString()}</Typography>
                  <Typography>ชำระแล้ว: ฿{selectedBooking.paidAmount.toLocaleString()}</Typography>
                  <Typography>คงเหลือ: ฿{selectedBooking.remainingAmount.toLocaleString()}</Typography>
                  <Chip
                    label={getPaymentStatusLabel(selectedBooking.paymentStatus)}
                    size="small"
                    sx={{
                      backgroundColor: getPaymentStatusColor(selectedBooking.paymentStatus),
                      color: 'white',
                      mt: 1,
                    }}
                  />
                </Box>
                
                {selectedBooking.notes && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>หมายเหตุ</Typography>
                    <Typography>{selectedBooking.notes}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setViewOpen(false)} sx={{ textTransform: 'none' }}>
              ปิด
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            แก้ไขสถานะการจอง
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  การจองของ: <strong>{selectedBooking.customerName}</strong>
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>สถานะ</InputLabel>
                  <Select
                    value={selectedBooking.status}
                    label="สถานะ"
                    onChange={(e) => {
                      setSelectedBooking({
                        ...selectedBooking,
                        status: e.target.value as any
                      });
                    }}
                  >
                    <MenuItem value="pending">รอยืนยัน</MenuItem>
                    <MenuItem value="confirmed">ยืนยันแล้ว</MenuItem>
                    <MenuItem value="in-progress">กำลังดำเนินงาน</MenuItem>
                    <MenuItem value="completed">เสร็จสิ้น</MenuItem>
                    <MenuItem value="cancelled">ยกเลิก</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>
              ยกเลิก
            </Button>
            <Button 
              onClick={() => {
                if (selectedBooking) {
                  handleStatusUpdate(selectedBooking.id, selectedBooking.status);
                  setEditOpen(false);
                }
              }} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingQueue; 