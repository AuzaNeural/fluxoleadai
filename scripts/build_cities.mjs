import fs from 'fs';

const rjData = fs.existsSync('locais_cidades_pais_BR_estado_RJ.json') 
  ? JSON.parse(fs.readFileSync('locais_cidades_pais_BR_estado_RJ.json', 'utf8')).items 
  : [];

const stateCities = {
  'RJ': rjData.length ? rjData : [
    { code: 'Rio de Janeiro', name: 'Rio de Janeiro' },
    { code: 'Niterói', name: 'Niterói' },
    { code: 'São Gonçalo', name: 'São Gonçalo' },
    { code: 'Duque de Caxias', name: 'Duque de Caxias' },
    { code: 'Nova Iguaçu', name: 'Nova Iguaçu' },
    { code: 'Petrópolis', name: 'Petrópolis' },
    { code: 'Arraial do Cabo', name: 'Arraial do Cabo' },
    { code: 'Cabo Frio', name: 'Cabo Frio' },
    { code: 'Campos dos Goytacazes', name: 'Campos dos Goytacazes' },
    { code: 'Volta Redonda', name: 'Volta Redonda' },
    { code: 'Macaé', name: 'Macaé' },
    { code: 'Angra dos Reis', name: 'Angra dos Reis' }
  ],
  'SP': [
    { code: 'São Paulo', name: 'São Paulo' },
    { code: 'Campinas', name: 'Campinas' },
    { code: 'Guarulhos', name: 'Guarulhos' },
    { code: 'São Bernardo do Campo', name: 'São Bernardo do Campo' },
    { code: 'Santo André', name: 'Santo André' },
    { code: 'Osasco', name: 'Osasco' },
    { code: 'Ribeirão Preto', name: 'Ribeirão Preto' },
    { code: 'Sorocaba', name: 'Sorocaba' },
    { code: 'São José dos Campos', name: 'São José dos Campos' },
    { code: 'Santos', name: 'Santos' },
    { code: 'São José do Rio Preto', name: 'São José do Rio Preto' },
    { code: 'Mogi das Cruzes', name: 'Mogi das Cruzes' },
    { code: 'Jundiaí', name: 'Jundiaí' },
    { code: 'Piracicaba', name: 'Piracicaba' },
    { code: 'Bauru', name: 'Bauru' }
  ],
  'MG': [
    { code: 'Belo Horizonte', name: 'Belo Horizonte' },
    { code: 'Uberlândia', name: 'Uberlândia' },
    { code: 'Contagem', name: 'Contagem' },
    { code: 'Juiz de Fora', name: 'Juiz de Fora' },
    { code: 'Betim', name: 'Betim' },
    { code: 'Montes Claros', name: 'Montes Claros' },
    { code: 'Ribeirão das Neves', name: 'Ribeirão das Neves' },
    { code: 'Uberaba', name: 'Uberaba' },
    { code: 'Governador Valadares', name: 'Governador Valadares' },
    { code: 'Ipatinga', name: 'Ipatinga' }
  ],
  'RS': [
    { code: 'Porto Alegre', name: 'Porto Alegre' },
    { code: 'Caxias do Sul', name: 'Caxias do Sul' },
    { code: 'Canoas', name: 'Canoas' },
    { code: 'Pelotas', name: 'Pelotas' },
    { code: 'Santa Maria', name: 'Santa Maria' },
    { code: 'Gravataí', name: 'Gravataí' },
    { code: 'Novo Hamburgo', name: 'Novo Hamburgo' }
  ],
  'PR': [
    { code: 'Curitiba', name: 'Curitiba' },
    { code: 'Londrina', name: 'Londrina' },
    { code: 'Maringá', name: 'Maringá' },
    { code: 'Ponta Grossa', name: 'Ponta Grossa' },
    { code: 'Cascavel', name: 'Cascavel' },
    { code: 'São José dos Pinhais', name: 'São José dos Pinhais' },
    { code: 'Foz do Iguaçu', name: 'Foz do Iguaçu' }
  ],
  'SC': [
    { code: 'Florianópolis', name: 'Florianópolis' },
    { code: 'Joinville', name: 'Joinville' },
    { code: 'Blumenau', name: 'Blumenau' },
    { code: 'São José', name: 'São José' },
    { code: 'Criciúma', name: 'Criciúma' },
    { code: 'Chapecó', name: 'Chapecó' },
    { code: 'Itajaí', name: 'Itajaí' },
    { code: 'Balneário Camboriú', name: 'Balneário Camboriú' }
  ],
  'BA': [
    { code: 'Salvador', name: 'Salvador' },
    { code: 'Feira de Santana', name: 'Feira de Santana' },
    { code: 'Vitória da Conquista', name: 'Vitória da Conquista' },
    { code: 'Camaçari', name: 'Camaçari' },
    { code: 'Juazeiro', name: 'Juazeiro' },
    { code: 'Itabuna', name: 'Itabuna' },
    { code: 'Ilhéus', name: 'Ilhéus' },
    { code: 'Porto Seguro', name: 'Porto Seguro' }
  ],
  'PE': [
    { code: 'Recife', name: 'Recife' },
    { code: 'Jaboatão dos Guararapes', name: 'Jaboatão dos Guararapes' },
    { code: 'Olinda', name: 'Olinda' },
    { code: 'Caruaru', name: 'Caruaru' },
    { code: 'Petrolina', name: 'Petrolina' },
    { code: 'Paulista', name: 'Paulista' }
  ],
  'CE': [
    { code: 'Fortaleza', name: 'Fortaleza' },
    { code: 'Caucaia', name: 'Caucaia' },
    { code: 'Juazeiro do Norte', name: 'Juazeiro do Norte' },
    { code: 'Maracanaú', name: 'Maracanaú' },
    { code: 'Sobral', name: 'Sobral' }
  ],
  'GO': [
    { code: 'Goiânia', name: 'Goiânia' },
    { code: 'Aparecida de Goiânia', name: 'Aparecida de Goiânia' },
    { code: 'Anápolis', name: 'Anápolis' },
    { code: 'Rio Verde', name: 'Rio Verde' },
    { code: 'Luziânia', name: 'Luziânia' }
  ],
  'DF': [
    { code: 'Brasília', name: 'Brasília' },
    { code: 'Taguatinga', name: 'Taguatinga' },
    { code: 'Ceilândia', name: 'Ceilândia' },
    { code: 'Águas Claras', name: 'Águas Claras' }
  ],
  'ES': [
    { code: 'Vitória', name: 'Vitória' },
    { code: 'Vila Velha', name: 'Vila Velha' },
    { code: 'Serra', name: 'Serra' },
    { code: 'Cariacica', name: 'Cariacica' },
    { code: 'Linhares', name: 'Linhares' }
  ]
};

// Also add basic cities for remaining states
const allUfs = ['AC', 'AL', 'AP', 'AM', 'MA', 'MT', 'MS', 'PA', 'PB', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO'];
allUfs.forEach(uf => {
  if (!stateCities[uf]) {
    stateCities[uf] = [
      { code: `Capital - ${uf}`, name: `Capital - ${uf}` },
      { code: `Região Metropolitana - ${uf}`, name: `Região Metropolitana - ${uf}` },
      { code: `Interior - ${uf}`, name: `Interior - ${uf}` }
    ];
  }
});

fs.writeFileSync('src/data/brazilCities.json', JSON.stringify(stateCities, null, 2));
console.log('Saved src/data/brazilCities.json with', Object.keys(stateCities).length, 'UFs');

