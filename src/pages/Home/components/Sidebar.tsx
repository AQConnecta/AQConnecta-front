import React from 'react'
import styled from 'styled-components'
import CompetencyCard from './CompetencyCard';
import { useEffect, useState } from 'react';
import { CompetenciaLevel } from '../../../services/endpoints/competencia';
import { enqueueSnackbar } from 'notistack';
import api from '../../../services/api';


const Container = styled.div`
  grid-area: left;
`

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #fff;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 15%),
    0 0 0 rgb(0 0 0 / 20%);
`

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
`

const CardBackground = styled.div`
  background: url('/images/card-bg.svg');
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`

const Photo = styled.div`
  box-shadow: none;
  background: url(${(props) => props.photoUrl});
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: #fff;
  background-position: center;
  background-size: 150%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
`

const Text = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`

const AddPhotoText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
`

const competencies = [
  {
    competencia: { id: '1', descricao: 'PHP' },
    level: 2,
  },
  {
    competencia: { id: '2', descricao: 'Java' },
    level: 4,
  },
  {
    competencia: { id: '3', descricao: 'JavaScript' },
    level: 1,
  },
];


function Left() {
  const [competenciasLevel, setCompetenciasLevel] = useState<CompetenciaLevel[]>([]);
  const [shouldReload, setShouldReload] = useState(0);

  useEffect(() => {
    async function getFormacaoAcademica() {
      try {
        const res = await api.competencia.listHotCompetencies();
        console.log(res.data.data)
        setCompetenciasLevel(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as competencias mais usadas', { variant: 'error' });
      }
    }

    getFormacaoAcademica();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }


  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo photoUrl="https://pbs.twimg.com/media/FTkEZfxWIAA0f4P.jpg" />
            <Text>
              Welcome
            </Text>
          </a>
          <a>
            <AddPhotoText>Add a photo</AddPhotoText>
          </a>
        </UserInfo>
        {/* <Widget>
            <a>
              <div>
                <span>Connections</span>
                <span>Grow Your Network</span>
              </div>
              <img src="/images/widget-icon.svg" alt="" />
            </a>
          </Widget> */}
      </ArtCard>
      <ArtCard>
        <CompetencyCard competencies={competenciasLevel} />
      </ArtCard>
    </Container>
  )
}

export default Left
