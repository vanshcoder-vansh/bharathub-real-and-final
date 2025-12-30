// Festive Theme Configuration
// Easy toggle for seasonal theme

export const festiveConfig = {
  // Master switch - set to false to disable entire festive theme
  enabled: true,
  
  // Auto-disable after this date (YYYY-MM-DD)
  endDate: '2025-01-05',
  
  // Show decorative elements (snowflakes, stars)
  showDecorations: true,
  
  // Show festive banner
  showBanner: true,
  
  // Theme colors (can be customized)
  colors: {
    primary: '#C41E3A',    // Festive Red
    secondary: '#165B33',  // Pine Green
    accent: '#D4AF37',     // Gold
    light: '#FFFAFA'       // Snow White
  }
};

// Helper function to check if theme should be active
export const isFestiveThemeActive = () => {
  if (!festiveConfig.enabled) return false;
  
  const currentDate = new Date();
  const endDate = new Date(festiveConfig.endDate + 'T23:59:59');
  
  return currentDate <= endDate;
};

// Helper to apply theme class
export const applyFestiveTheme = () => {
  if (isFestiveThemeActive()) {
    document.body.classList.add('festive-theme');
  } else {
    document.body.classList.remove('festive-theme');
  }
};
