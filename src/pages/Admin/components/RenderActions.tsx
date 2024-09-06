/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import React, { useState } from 'react';

type RenderActionsProps = {
    params: any;
    EditModal: React.FC;
    handleDeleteRow: (id) => void;
    noEdit?: boolean;
};

function RenderActions(props: RenderActionsProps) {
  const { params, EditModal, handleDeleteRow, noEdit } = props;
  const { id } = params.row;
  const [isEditOpen, setIsEditOpen] = useState(false);

  function handleEditRow() {
    setIsEditOpen(true);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
      {!noEdit && (
        <>
          <EditModal isOpen={isEditOpen} handleClose={() => setIsEditOpen(false)} editObj={params.row} />
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditRow(id)}
          />
        </>
      )}
      <GridActionsCellItem icon={<DeleteIcon />} onClick={() => handleDeleteRow(id)} label="Delete" />
    </Box>
  );
}

export default RenderActions;
