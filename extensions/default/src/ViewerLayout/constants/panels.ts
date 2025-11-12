const expandedInsideBorderSize = 0;
const collapsedInsideBorderSize = 4;
const collapsedOutsideBorderSize = 4;
const collapsedWidth = 25;

const getPanelGroupDefinition = ({
  // 🩻 LEFT PANEL — Reduced
  leftPanelInitialExpandedWidth = 220, // from 282 → 220
  leftPanelMinimumExpandedWidth = 130, // slightly smaller minimum

  // 📋 RIGHT PANEL — Increased
  rightPanelInitialExpandedWidth = 500, // from 280 → 500 ✅
  rightPanelMinimumExpandedWidth = 400, // to keep smooth resize behavior
} = {}) => {
  return {
    groupId: 'viewerLayoutResizablePanelGroup',
    shared: {
      expandedInsideBorderSize,
      collapsedInsideBorderSize,
      collapsedOutsideBorderSize,
      collapsedWidth,
    },
    left: {
      panelId: 'viewerLayoutResizableLeftPanel',
      initialExpandedWidth: leftPanelInitialExpandedWidth,
      minimumExpandedOffsetWidth: leftPanelMinimumExpandedWidth + expandedInsideBorderSize,
      initialExpandedOffsetWidth: leftPanelInitialExpandedWidth + expandedInsideBorderSize,
      collapsedOffsetWidth: collapsedWidth + collapsedInsideBorderSize + collapsedOutsideBorderSize,
    },
    right: {
      panelId: 'viewerLayoutResizableRightPanel',
      initialExpandedWidth: rightPanelInitialExpandedWidth,
      minimumExpandedOffsetWidth: rightPanelMinimumExpandedWidth + expandedInsideBorderSize,
      initialExpandedOffsetWidth: rightPanelInitialExpandedWidth + expandedInsideBorderSize,
      collapsedOffsetWidth: collapsedWidth + collapsedInsideBorderSize + collapsedOutsideBorderSize,
    },
  };
};

export { getPanelGroupDefinition };
