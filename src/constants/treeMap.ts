export const TREE_MAP_CONSTANTS = {
  COLORS: {
    DEFAULT_RANGE: ['#4ecdc4', '#ff6b6b'],
    BACKGROUND: '#f5f5f5',
    BORDER: 'rgba(0, 0, 0, 0.1)',
    BREADCRUMB_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
    BREADCRUMB_TEXT: '#007bff'
  },
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
    PATTERN_FILL: 'patternFill',
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