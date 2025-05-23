import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const HLRPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 70,
    },
    {
      field: 'tt',
      headerName: 'TT',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value || '-'
    },
    {
      field: 'np',
      headerName: 'NP',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value || '-'
    },
    {
      field: 'na',
      headerName: 'NA',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value || '-'
    },
    {
      field: 'ns',
      headerName: 'NS',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value || '-'
    },
    {
      field: 'gtrc',
      headerName: 'GTRC',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => params.value || '-'
    },
    {
      field: 'created_at',
      headerName: 'Date de création',
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => {
        if (!params.value) return '-';
        try {
          const date = new Date(params.value);
          return date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } catch (error) {
          console.error('Erreur de formatage de date:', error);
          return '-';
        }
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5178/hlrr');
      console.log('Données reçues:', response.data.data); // Pour le débogage
      setRows(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données HLR:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5178/import-hlr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message) {
        // Rafraîchir les données après l'import
        await fetchData();
      }
    } catch (err) {
      console.error('Erreur lors de l\'import du fichier:', err);
      setError('Erreur lors de l\'import du fichier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion HLR
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Importer un fichier HLR
          <input
            type="file"
            hidden
            accept=".log,.txt"
            onChange={handleFileUpload}
          />
        </Button>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            getRowId={(row) => row.id || Math.random()}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default HLRPage; 