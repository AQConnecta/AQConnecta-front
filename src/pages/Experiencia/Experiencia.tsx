import {Box, Button, Typography} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import api from '../../services/api';
import {enqueueSnackbar} from 'notistack';
import {Usuario} from '../../services/endpoints/auth';
import {useNavigate} from 'react-router-dom';
import {Experiencia} from "../../services/endpoints/experiencia.ts";


function MinhaExperiencia() {
    const user: Usuario = JSON.parse(localStorage.getItem('user') || '{}');
    const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getExperiencia() {
            try {
                const res = await api.experiencia.getExperiencia(user.id);
                setExperiencias(res.data.data);
            } catch (err) {
                enqueueSnackbar('Erro ao buscar experiencia', {variant: 'error'});
            }
        }

        getExperiencia();
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    // function handleRegisterClick() {
    //     navigate('register')
    // }

    return (
        <Box
            height="100%"
            width="100%"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <Box
                width="100%"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 1px 2px #0003',
                    backgroundColor: 'white',
                    maxWidth: '350px',
                    padding: '20px',
                    borderRadius: '5px',
                }}
            >
                {experiencias.length > 0 ? (
                    experiencias.map((experiencia, index) => (
                        <Box key={index}>
                            <Typography variant="h6">Experiência {index + 1}</Typography>
                            <Typography variant="body1">{experiencia.titulo} - {experiencia.instituicao}</Typography>
                            <Typography
                                variant="body1">{formatDate(experiencia.dataInicio)} - {experiencia.atualExperiencia ? 'até o momento' : formatDate(experiencia.dataFim)}</Typography>
                            <hr
                                style={{
                                    color: "black",
                                    backgroundColor: "red",
                                }}
                            />
                            <Typography variant="body1">{experiencia.descricao}</Typography>
                            <Button variant="contained" sx={{width: '100%', height: '50px'}}>
                                Editar
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Box>
                        <Typography variant="body1">Experiência não encontrada</Typography>
                        <Button variant='contained'>Cadastrar experiência</Button>
                        {/* onClick={() => handleRegisterClick()} */}
                    </Box>
                )}

            </Box>
        </Box>
    );
}

export default MinhaExperiencia;
