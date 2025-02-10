// NavigationMenu.js
import React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useNavigate } from 'react-router-dom';

const NavigationMenu = () => {
  const navigate = useNavigate();

  const handleNodeSelect = (event, nodeId) => {
    // Navigate to the corresponding route based on the selected nodeId
    navigate(nodeId);
  };

  const menuItems = [
    {
      id: '/task-tree',
      name: 'Task Tree',
    },
    {
      id: '/status',
      name: 'Status',
    },
    {
      id: '/dependencies',
      name: 'Dependencies',
    },
  ];

  return (
    <RichTreeView
      items={menuItems}
      onNodeSelect={handleNodeSelect}
    />
  );
};

export default NavigationMenu;
