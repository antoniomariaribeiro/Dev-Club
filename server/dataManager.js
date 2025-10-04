const fs = require('fs');
const path = require('path');

// Diretório para armazenar dados persistentes
const DATA_DIR = path.join(__dirname, 'data');

// Criar diretório se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Função para carregar dados de um arquivo JSON
function loadData(filename, defaultData = []) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Erro ao carregar ${filename}:`, error);
  }
  
  // Se não existe ou erro, retorna dados padrão e salva
  saveData(filename, defaultData);
  return defaultData;
}

// Função para salvar dados em um arquivo JSON
function saveData(filename, data) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${filename}:`, error);
    return false;
  }
}

module.exports = {
  loadData,
  saveData
};