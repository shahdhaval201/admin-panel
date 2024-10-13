// src/components/EstimationModule.js

import React, { useState } from 'react';
import EstimationList from '../../components/estimations/EstimationList';
import EstimationForm from '../../components/estimations/EstimationForm';

const EstimationModule = () => {
  const [selectedEstimation, setSelectedEstimation] = useState(null);

  const handleEdit = (estimation) => {
    setSelectedEstimation(estimation);
  };

  const handleCloseForm = () => {
    setSelectedEstimation(null); // Close the form and reset the selected estimation
  };

  return (
    <div>
      {/* Estimation List Component */}
      <EstimationList onEdit={handleEdit} />

      {/* Estimation Form Component */}
      {selectedEstimation && (
        <EstimationForm estimation={selectedEstimation} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default EstimationModule;
