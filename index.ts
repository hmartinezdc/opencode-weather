import { loadState } from './src/storage.ts';
import { showMenu, getInput, pressEnterToContinue } from './src/menu.ts';
import { red } from './src/colors.ts';
import { 
  handleOption1, 
  handleOption2, 
  handleOption3, 
  handleOption4, 
  handleOption5 
} from './src/cities.ts';
import { handleOption8 } from './src/settings.ts';

async function main(): Promise<void> {
  const state = await loadState();
  
  while (true) {
    showMenu(state);
    const choice = await getInput();
    
    switch (choice) {
      case '1':
        await handleOption1(state);
        break;
      case '2':
        await handleOption2(state);
        break;
      case '3':
        await handleOption3(state);
        break;
      case '4':
        await handleOption4(state);
        break;
      case '5':
        await handleOption5(state);
        break;
      case '8':
        await handleOption8(state);
        break;
      case '9':
        console.log('\n  ¡Hasta luego!\n');
        process.exit(0);
      default:
        console.log(`\n  ${red('Opción inválida.')}\n`);
        await pressEnterToContinue();
    }
  }
}

main().catch(console.error);