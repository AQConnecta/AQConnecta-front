import axios, { AxiosResponse } from './_axios'

const PREFIX = '/competencia'

export type AreaAtuacao =
  | 'TECNOLOGIA' | 'SAUDE' | 'EDUCACAO' | 'ENGENHARIA' | 'ADMINISTRACAO'
  | 'FINANCAS' | 'DIREITO' | 'COMUNICACAO_MARKETING' | 'DESIGN_ARTES'
  | 'CIENCIAS_HUMANAS' | 'AGRONEGOCIO_MEIO_AMBIENTE' | 'INDUSTRIA_PRODUCAO'
  | 'SERVICOS' | 'PESQUISA_CIENCIA' | 'OUTRO'

export const AREA_ATUACAO_LABELS: Record<AreaAtuacao, string> = {
  TECNOLOGIA: 'Tecnologia / TI',
  SAUDE: 'Saúde',
  EDUCACAO: 'Educação',
  ENGENHARIA: 'Engenharia',
  ADMINISTRACAO: 'Administração / Gestão',
  FINANCAS: 'Finanças / Contabilidade',
  DIREITO: 'Direito',
  COMUNICACAO_MARKETING: 'Comunicação / Marketing',
  DESIGN_ARTES: 'Design / Artes',
  CIENCIAS_HUMANAS: 'Ciências Humanas e Sociais',
  AGRONEGOCIO_MEIO_AMBIENTE: 'Agronegócio / Meio Ambiente',
  INDUSTRIA_PRODUCAO: 'Indústria / Produção',
  SERVICOS: 'Serviços',
  PESQUISA_CIENCIA: 'Pesquisa / Ciência',
  OUTRO: 'Outro',
}

export const AREA_ATUACAO_OPTIONS: AreaAtuacao[] = [
  'TECNOLOGIA', 'SAUDE', 'EDUCACAO', 'ENGENHARIA', 'ADMINISTRACAO', 'FINANCAS', 'DIREITO',
  'COMUNICACAO_MARKETING', 'DESIGN_ARTES', 'CIENCIAS_HUMANAS', 'AGRONEGOCIO_MEIO_AMBIENTE',
  'INDUSTRIA_PRODUCAO', 'SERVICOS', 'PESQUISA_CIENCIA', 'OUTRO',
]

export type Competencia = {
    id: string
    descricao: string
    categoria?: AreaAtuacao | null
    status?: string
}

export type CompetenciaLevel = {
    competencia: Competencia,
    level: number
}

export class CompetenciaEndpoint {
    async listAll(
        search: string = '',
        page: number = 0,
        size: number = 100
    ): Promise<AxiosResponse<Array<Competencia>>> {
        const url = `${PREFIX}/listar?search=${encodeURIComponent(search)}&page=${page}&size=${size}`;
        return await axios.get(url);
    }

    async listByUserId(userId: string): Promise<AxiosResponse<Array<Competencia>>> {
        return await axios.get(`${PREFIX}/listar_por_usuario/${userId}`)
    }

    async linkCompetenciaToMe(data: {competencias: Array<{id: string}>}): Promise<any> {
        return await axios.post(`${PREFIX}/relacionar_competencia_usuario`, data)
    }

    async removeCompetenciaFromMe(data: {competencias: Array<{id: string}>}): Promise<any> {
        return await axios.delete(`${PREFIX}/remover_relacao_usuario`, { data })
    }
    
    async listHotCompetencies(): Promise<AxiosResponse<Array<CompetenciaLevel>>> {
        return await axios.get(`${PREFIX}/competencias_quentes`)
    }

    async linkCompetenciaVaga(data: {competencias: Array<Competencia>, idVaga: string}): Promise<any> {
        return await axios.post(`${PREFIX}/relacionar_competencia_vaga`, data)
    }

    async cadastrarCompetencia(data: {descricao: string}): Promise<void> {
        return await axios.post(`${PREFIX}/cadastrar`, data)
    }

    async deletarCompetencia(id: string): Promise<void> {
        return await axios.delete(`${PREFIX}/deletar/${id}`)
    }

    async sugestoesPorArea(area: AreaAtuacao): Promise<AxiosResponse<Array<Competencia>>> {
        return await axios.get(`${PREFIX}/por_area`, { params: { area } })
    }

    async sugerir(data: { descricao: string; categoria?: AreaAtuacao }): Promise<any> {
        return await axios.post(`${PREFIX}/sugerir`, data)
    }

    async listarPendentes(): Promise<AxiosResponse<Array<Competencia>>> {
        return await axios.get(`${PREFIX}/pendentes`)
    }

    async aprovarCompetencia(id: string): Promise<void> {
        return await axios.put(`${PREFIX}/aprovar/${id}`)
    }

    async recusarCompetencia(id: string): Promise<void> {
        return await axios.delete(`${PREFIX}/recusar/${id}`)
    }
}