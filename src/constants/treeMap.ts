export const TREE_MAP_CONSTANTS = {
  COLORS: {
    DEFAULT_RANGE: ['#ff6b6b', '#4ecdc4'],
    BACKGROUND: '#f5f5f5',
    BORDER: 'rgba(0, 0, 0, 0.1)',
    BREADCRUMB_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
    BREADCRUMB_TEXT: '#007bff'
  },
  ANIMATION: {
    DEFAULT_DURATION: 500
  },
  LAYOUT: {
    DEFAULT_PADDING_INNER: 1,
    DEFAULT_PADDING_OUTER: 50,
    DEFAULT_BORDER_RADIUS: 2,
    DEFAULT_MIN_DISPLAY_VALUE: 0
  },
  TOOLTIP: {
    DEFAULT_POSITION: 'mouseRight' as const
  },
  DEFAULT_COLOR_RANGE_BEHAVIOR: 'heatmap' as const,
  BREADCRUMBS_ENABLED: true,
  COLOR_RANGE_BEHAVIOR: {
    ONE_COLOR: 'oneColor',
    GRADIENT: 'gradient',
    DISCRETE: 'discrete',
    TRANSPARENT: 'transparent',
    BORDER_ONLY: 'borderOnly',
    RANDOM: 'random',
    PATTERN_FILL: 'patternFill',
    HEATMAP: 'heatmap'
  }
}; 