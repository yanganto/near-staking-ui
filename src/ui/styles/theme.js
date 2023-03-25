export const getCustomThemeStyles = (isDarkTheme) => {
  return {
    shadows: {
      main: isDarkTheme
        ? '0px 38px 80px rgba(54, 223, 211, 0.0393604), 0px 15.8755px 33.4221px rgba(54, 223, 211, 0.056545), ' +
          '0px 8.4878px 17.869px rgba(54, 223, 211, 0.07), 0px 4.75819px 10.0172px rgba(54, 223, 211, 0.083455), ' +
          '0px 2.52704px 5.32008px rgba(54, 223, 211, 0.10064), 0px 1.05156px 2.21381px rgba(54, 223, 211, 0.14)'
        : '0px 38px 80px rgba(128, 47, 243, 0.0393604), 0px 15.8755px 33.4221px rgba(128, 47, 243, 0.056545), ' +
          '0px 8.4878px 17.869px rgba(128, 47, 243, 0.07), 0px 4.75819px 10.0172px rgba(128, 47, 243, 0.083455), ' +
          '0px 2.52704px 5.32008px rgba(128, 47, 243, 0.10064), 0px 1.05156px 2.21381px rgba(128, 47, 243, 0.14)',
      btn: isDarkTheme
        ? `0px 26px 30px rgba(54, 223, 211, 0.24), 0px 13px 150px rgba(54, 223, 211, 0.18), 0px 8px 90px rgba(54, 223, 211, 0.15), 0px 5px 58px rgba(54, 223, 211, 0.14), 0px 3px 38px rgba(54, 223, 211, 0.12), 0px 2px 24px rgba(54, 223, 211, 0.1), 0px 1px 13px rgba(54, 223, 211, 0.08), 0px 1px 6px rgba(54, 223, 211, 0.06);`
        : '0px 26px 30px rgba(128, 47, 243, 0.24), 0px 13px 150px rgba(128, 47, 243, 0.18), 0px 8px 90px rgba(128, 47, 243, 0.15), 0px 5px 58px rgba(128, 47, 243, 0.14), 0px 3px 38px rgba(128, 47, 243, 0.12), 0px 2px 24px rgba(128, 47, 243, 0.1), 0px 1px 13px rgba(128, 47, 243, 0.08), 0px 1px 6px rgba(128, 47, 243, 0.06);',
    },
  };
};
