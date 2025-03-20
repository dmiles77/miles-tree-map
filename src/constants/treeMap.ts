export const TREE_MAP_CONSTANTS = {
  COLORS: {
    DEFAULT_RANGE: ['#4ecdc4', '#ff6b6b'],
    BACKGROUND: '#f5f5f5',
    BORDER: 'rgba(0, 0, 0, 0.1)',
    BREADCRUMB_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
    BREADCRUMB_TEXT: '#007bff'
  },
  WILD_COLOR_SCHEMES: [
    // Vibrant
    ['#FF3366', '#FF6633', '#FFCC33', '#33CC33', '#3366FF', '#CC33FF'],
    // Ocean
    ['#003F5C', '#2F4B7C', '#665191', '#A05195', '#D45087', '#F95D6A', '#FF7C43', '#FFA600'],
    // Forest
    ['#1E5631', '#4E9525', '#8ABA4F', '#D4E6B5', '#97D8C4', '#4B8F8C', '#2F5233'],
    // Sunset
    ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B', '#577590'],
    // Pastel
    ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF']
  ],
  ANIMATION: {
    DEFAULT_DURATION: 500
  },
  LAYOUT: {
    DEFAULT_PADDING_INNER: 10,
    DEFAULT_PADDING_OUTER: 50,
    DEFAULT_BORDER_RADIUS: 2
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
    RANDOM_RANGE_COLOR: 'randomRangeColor',
    WILD: 'wild',
    HEATMAP: 'heatmap'
  },
  BREADCRUMBS_HEIGHT: 40,
  ANIMATION_PHASE: {
    IDLE: 'idle' as const,
    EXPANDING: 'expanding' as const,
    EXPANDED: 'expanded' as const,
    SHOWING_CHILDREN: 'showing-children' as const
  }
}; 

export type AnimationPhase = 
  | typeof TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE
  | typeof TREE_MAP_CONSTANTS.ANIMATION_PHASE.EXPANDING
  | typeof TREE_MAP_CONSTANTS.ANIMATION_PHASE.EXPANDED
  | typeof TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN; 