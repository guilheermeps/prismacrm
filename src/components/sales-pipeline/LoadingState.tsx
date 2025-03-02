
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-2">Carregando pipeline de vendas...</span>
    </div>
  );
};

export default LoadingState;
