// This script can be run in the browser console to test sidebar functionality
(function() {
  console.log('Starting sidebar test...');
  
  // Test 1: Check if sidebar metrics are loading
  const checkMetrics = () => {
    const badges = document.querySelectorAll('.sidebar-badge');
    console.log(`Found ${badges.length} metric badges in the sidebar`);
    
    const loadingSpinners = document.querySelectorAll('.sidebar-loading');
    console.log(`Found ${loadingSpinners.length} loading spinners`);
    
    return badges.length > 0;
  };
  
  // Test 2: Check responsive design
  const testResponsiveness = () => {
    const originalWidth = window.innerWidth;
    
    // Simulate mobile viewport
    console.log('Testing mobile view (width: 500px)...');
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    
    // Give it a moment to react
    setTimeout(() => {
      const mobileToggle = document.querySelector('.mobile-toggle');
      console.log(`Mobile toggle button visible: ${mobileToggle ? 'yes' : 'no'}`);
      
      // Restore original size
      console.log('Restoring original viewport size...');
      window.innerWidth = originalWidth;
      window.dispatchEvent(new Event('resize'));
    }, 500);
  };
  
  // Test 3: Check database refresh
  const monitorMetricsRefresh = () => {
    console.log('Monitoring metrics refresh for 35 seconds...');
    
    // Store initial values
    const getMetricValues = () => {
      const result = {};
      document.querySelectorAll('[data-metric-key]').forEach(el => {
        const key = el.getAttribute('data-metric-key');
        const value = el.textContent.trim();
        result[key] = value;
      });
      return result;
    };
    
    const initialValues = getMetricValues();
    console.log('Initial metric values:', initialValues);
    
    // Check after 31 seconds (should have refreshed)
    setTimeout(() => {
      const newValues = getMetricValues();
      console.log('New metric values after 31s:', newValues);
      
      let changed = false;
      for (const key in initialValues) {
        if (initialValues[key] !== newValues[key]) {
          changed = true;
          console.log(`Metric ${key} changed from ${initialValues[key]} to ${newValues[key]}`);
        }
      }
      
      if (changed) {
        console.log('✅ TEST PASSED: Metrics refreshed successfully');
      } else {
        console.log('❌ TEST FAILED: Metrics did not refresh');
      }
    }, 31000);
  };
  
  // Run the tests
  if (checkMetrics()) {
    console.log('✅ TEST PASSED: Sidebar metrics are displayed');
    testResponsiveness();
    monitorMetricsRefresh();
  } else {
    console.log('❌ TEST FAILED: Sidebar metrics not found');
  }
})(); 