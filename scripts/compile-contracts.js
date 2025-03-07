const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Create contracts directory if it doesn't exist
const contractsDir = path.join(__dirname, '../contracts');
const buildDir = path.join(__dirname, '../build');

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Get all Solidity files from contracts directory
const contractFiles = fs.readdirSync(contractsDir).filter(file => file.endsWith('.sol'));

console.log('Compiling contracts:');
contractFiles.forEach(file => console.log(`- ${file}`));

// Compile each contract
contractFiles.forEach(file => {
  const contractPath = path.join(contractsDir, file);
  const contractSource = fs.readFileSync(contractPath, 'utf8');
  
  // Prepare input for solc compiler
  const input = {
    language: 'Solidity',
    sources: {
      [file]: {
        content: contractSource
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };
  
  try {
    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Check for errors
    if (output.errors) {
      console.error(`Error compiling ${file}:`);
      output.errors.forEach(error => {
        console.error(error.formattedMessage);
      });
      return;
    }
    
    // Save the compiled contract
    const contractName = file.replace('.sol', '');
    const compiledContract = output.contracts[file][contractName];
    
    fs.writeFileSync(
      path.join(buildDir, `${contractName}.json`),
      JSON.stringify({
        abi: compiledContract.abi,
        bytecode: compiledContract.evm.bytecode.object
      }, null, 2)
    );
    
    console.log(`Successfully compiled ${file}`);
  } catch (error) {
    console.error(`Error compiling ${file}:`, error.message);
  }
});

 