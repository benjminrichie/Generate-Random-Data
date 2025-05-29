import { useState } from 'react';
import { Plus, Trash2, Download, Database, FileText, ChevronDown, ChevronUp, X, Settings, Copy, Check } from 'lucide-react';

export default function RandomDataGenerator() {
  const [count, setCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [data, setData] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [activeTab, setActiveTab] = useState('columns');
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSection, setExpandedSection] = useState('gender');
  
  // Customizable gender options
  const [genderOptions, setGenderOptions] = useState(['Male', 'Female']);
  const [newGenderOption, setNewGenderOption] = useState('');
  
  // Dynamic columns management
  const [columns, setColumns] = useState([
    { name: 'Surname', type: 'name', subtype: 'surname' },
    { name: 'Other_names', type: 'name', subtype: 'fullname' },
    { name: 'Gender', type: 'gender' }
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('name');
  const [newColumnSubtype, setNewColumnSubtype] = useState('fullname');
  const [newColumnOptions, setNewColumnOptions] = useState('');

  // Sample data for generation
  const dataBank = {
    surname: [
      'Adebayo', 'Okonkwo', 'Okafor', 'Nwachukwu', 'Afolayan', 'Olawale', 'Adeyemi', 'Eze', 'Chukwu', 'Obasanjo',
      'Abiodun', 'Adeleke', 'Adesina', 'Agbaje', 'Akande', 'Akinlade', 'Akintola', 'Amusan', 'Ayodele', 'Babangida',
      'Balogun', 'Chibuike', 'Chidimma', 'Chinedu', 'Chisom', 'Danjuma', 'Eberechi', 'Egwu', 'Ekwueme', 'Emeka',
      'Ezekwesili', 'Falana', 'Fashola', 'Gowon', 'Ibrahim', 'Igwe', 'Iheanacho', 'Ikenna', 'Ike', 'Iwobi',
    ],
    firstname: [
      'Adebola', 'Chioma', 'Oluwaseun', 'Ngozi', 'Emeka', 'Yetunde', 'Chinedu', 'Folake', 'Ikechukwu', 'Adaeze',
      'Oluwadamilola', 'Obinna', 'Aisha', 'Tunde', 'Amaka', 'Olumide', 'Nneka', 'Babatunde', 'Chika', 'Adewale',
    ],
    middlename: [
      'Oluwaseyi', 'Chibuzo', 'Adebisi', 'Chukwuebuka', 'Ayomide', 'Oluwafemi', 'Chidubem', 'Folakemi', '', '',
    ],
    state: [
      'Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo', 'Kaduna', 'Anambra', 'Imo', 'Delta', 'Akwa Ibom',
    ],
    city: [
      'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Enugu', 'Aba', 'Onitsha',
    ],
    email: [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com', 'mail.com', 'icloud.com',
    ]
  };

  const addGenderOption = () => {
    if (!newGenderOption.trim()) return;
    if (genderOptions.includes(newGenderOption.trim())) return;
    setGenderOptions([...genderOptions, newGenderOption.trim()]);
    setNewGenderOption('');
  };

  const removeGenderOption = (option) => {
    if (genderOptions.length <= 1) return;
    setGenderOptions(genderOptions.filter(gender => gender !== option));
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;
    
    const columnExists = columns.some(col => col.name === newColumnName);
    if (columnExists) return;

    const newColumn = {
      name: newColumnName,
      type: newColumnType
    };

    if (newColumnType === 'name' || newColumnType === 'location') {
      newColumn.subtype = newColumnSubtype;
    }

    if (newColumnType === 'category' && newColumnOptions.trim()) {
      newColumn.options = newColumnOptions.split(',').map(opt => opt.trim());
    }

    setColumns([...columns, newColumn]);
    setNewColumnName('');
    setNewColumnOptions('');
  };

  const removeColumn = (index) => {
    if (columns.length <= 1) return;
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const generateRandomValue = (column) => {
    switch (column.type) {
      case 'name':
        if (column.subtype === 'surname') {
          return dataBank.surname[Math.floor(Math.random() * dataBank.surname.length)];
        } else if (column.subtype === 'firstname') {
          return dataBank.firstname[Math.floor(Math.random() * dataBank.firstname.length)];
        } else if (column.subtype === 'fullname') {
          const firstName = dataBank.firstname[Math.floor(Math.random() * dataBank.firstname.length)];
          const hasMiddle = Math.random() > 0.5;
          const middleName = hasMiddle ? dataBank.middlename[Math.floor(Math.random() * dataBank.middlename.length)] : '';
          return middleName ? `${firstName} ${middleName}` : firstName;
        }
        return '';
      
      case 'gender':
        return genderOptions[Math.floor(Math.random() * genderOptions.length)];
      
      case 'category':
        if (column.options && column.options.length > 0) {
          return column.options[Math.floor(Math.random() * column.options.length)];
        }
        return 'N/A';
      
      case 'number':
        return Math.floor(Math.random() * 1000) + 1;
      
      case 'date':
        const start = new Date(2000, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
          .toISOString().split('T')[0];
      
      case 'email':
        const namePool = dataBank.firstname.concat(dataBank.surname);
        const name = namePool[Math.floor(Math.random() * namePool.length)].toLowerCase();
        const domain = dataBank.email[Math.floor(Math.random() * dataBank.email.length)];
        const randomNum = Math.floor(Math.random() * 10000);
        return `${name}${randomNum}@${domain}`;
      
      default:
        return 'N/A';
    }
  };

  const generateRandomData = () => {
    if (count > 10000 || count < 1 || columns.length === 0) return;

    setIsGenerating(true);
    setGeneratedCount(0);
    const newData = [];
    
    const chunkSize = 500;
    const totalChunks = Math.ceil(count / chunkSize);
    
    const processChunk = (chunkIndex) => {
      if (chunkIndex >= totalChunks) {
        setData(newData);
        setIsGenerating(false);
        setShowPreview(true);
        return;
      }
      
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, count);
      
      setTimeout(() => {
        for (let i = start; i < end; i++) {
          const record = {};
          
          columns.forEach(column => {
            record[column.name] = generateRandomValue(column);
          });
          
          newData.push(record);
        }
        
        setGeneratedCount(end);
        processChunk(chunkIndex + 1);
      }, 0);
    };
    
    processChunk(0);
  };

  const downloadData = () => {
    if (data.length === 0) return;
    setIsDownloading(true);
    
    try {
      // Create CSV content for simplicity
      let csvContent = columns.map(col => col.name).join(',') + '\n';
      
      data.forEach(row => {
        const values = columns.map(col => {
          const value = row[col.name] || '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += values.join(',') + '\n';
      });
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `random_data.${downloadFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleExpandSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (data.length === 0) return;
    
    const jsonContent = JSON.stringify(data.slice(0, 10), null, 2);
    navigator.clipboard.writeText(jsonContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Synthetic Data Generator
          </h1>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2 border border-gray-700">
              <Database size={16} className="text-purple-400" />
              <input
                type="number"
                min="1"
                max="10000"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                className="bg-transparent w-16 focus:outline-none"
                placeholder="100"
              />
              <span className="text-sm text-gray-400">records</span>
            </div>
            <button
              onClick={generateRandomData}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Database size={16} />
              <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left panel for configuration */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('columns')}
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'columns' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
                >
                  Columns
                </button>
                <button
                  onClick={() => setActiveTab('options')}
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'options' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
                >
                  Options
                </button>
              </div>
              
              {activeTab === 'columns' && (
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Schema Configuration</h3>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{columns.length} columns</span>
                    </div>
                    
                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
                      {columns.map((column, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2 group">
                          <div>
                            <div className="text-sm font-medium">{column.name}</div>
                            <div className="text-xs text-gray-400">
                              {column.type} 
                              {column.subtype && ` • ${column.subtype}`}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeColumn(index)}
                            className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-700/30 rounded-lg p-3 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Column Name</label>
                        <input
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g. Age, Country"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Type</label>
                          <select
                            value={newColumnType}
                            onChange={(e) => setNewColumnType(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="name">Name</option>
                            <option value="gender">Gender</option>
                            <option value="category">Category</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="email">Email</option>
                          </select>
                        </div>
                        
                        {newColumnType === 'name' && (
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Subtype</label>
                            <select
                              value={newColumnSubtype}
                              onChange={(e) => setNewColumnSubtype(e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                              <option value="fullname">Full Name</option>
                              <option value="firstname">First Name</option>
                              <option value="surname">Surname</option>
                            </select>
                          </div>
                        )}
                        
                        {newColumnType === 'category' && (
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Options</label>
                            <input
                              type="text"
                              value={newColumnOptions}
                              onChange={(e) => setNewColumnOptions(e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                              placeholder="Option1, Option2..."
                            />
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={addColumn}
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg py-2 text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>Add Column</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'options' && (
                <div className="p-4">
                  <div className="mb-6">
                    <div 
                      className="flex justify-between items-center mb-3 cursor-pointer"
                      onClick={() => toggleExpandSection('gender')}
                    >
                      <h3 className="text-lg font-medium">Gender Options</h3>
                      {expandedSection === 'gender' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    
                    {expandedSection === 'gender' && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {genderOptions.map((option, index) => (
                            <div key={index} className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                              <span className="mr-2">{option}</span>
                              <button 
                                onClick={() => removeGenderOption(option)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newGenderOption}
                            onChange={(e) => setNewGenderOption(e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Add gender option"
                          />
                          <button
                            onClick={addGenderOption}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg px-3 py-2"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div 
                      className="flex justify-between items-center mb-3 cursor-pointer"
                      onClick={() => toggleExpandSection('export')}
                    >
                      <h3 className="text-lg font-medium">Export Options</h3>
                      {expandedSection === 'export' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    
                    {expandedSection === 'export' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Format</label>
                          <select
                            value={downloadFormat}
                            onChange={(e) => setDownloadFormat(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="csv">CSV (.csv)</option>
                            <option value="json">JSON (.json)</option>
                            <option value="txt">Text (.txt)</option>
                            <option value="html">HTML (.html)</option>
                            <option value="xml">XML (.xml)</option>
                            <option value="xlsx">Excel (.xlsx)</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={downloadData}
                          disabled={isDownloading || data.length === 0}
                          className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg py-2 text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download size={16} />
                          <span>{isDownloading ? 'Downloading...' : 'Download Data'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right panel for preview */}
          <div className="col-span-12 lg:col-span-8">
            {isGenerating ? (
              <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
                <div className="w-full max-w-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Generating data...</span>
                    <span className="text-sm text-gray-400">{generatedCount}/{count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(generatedCount / count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-gray-400 text-sm animate-pulse">Processing chunk {Math.ceil(generatedCount / 500)} of {Math.ceil(count / 500)}</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 h-full flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium flex items-center">
                    <FileText size={16} className="mr-2 text-blue-400" />
                    Data Preview
                    {data.length > 0 && (
                      <span className="text-xs text-gray-400 ml-2 bg-gray-700 px-2 py-0.5 rounded-full">
                        {data.length} records
                      </span>
                    )}
                  </h3>
                  {data.length > 0 && (
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center text-sm text-gray-400 hover:text-gray-200"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="mr-1 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="p-4 flex-1 overflow-auto custom-scrollbar">
                  {data.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            {columns.map((column, index) => (
                              <th key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/50 first:rounded-l-lg last:rounded-r-lg">
                                {column.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {data.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-700/30">
                              {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-3 py-2 text-sm whitespace-nowrap">
                                  {row[column.name]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {data.length > 10 && (
                        <div className="text-center mt-6 text-gray-400 text-sm">
                          Showing first 10 records of {data.length}. Use the download button to get the complete dataset.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Database size={48} className="mb-4 opacity-30" />
                      <p className="text-lg mb-2">No data generated yet</p>
                      <p className="text-sm max-w-md text-center">Configure your columns and click "Generate" to create synthetic data.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}