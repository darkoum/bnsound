const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Web vitals reporting - optional performance monitoring
    try {
      // Performance monitoring can be added here if needed
      console.log('Performance monitoring initialized');
    } catch (error) {
      console.log('Performance monitoring not available');
    }
  }
};

export default reportWebVitals;
