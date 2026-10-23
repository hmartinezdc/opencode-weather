import { loadState } from './src/storage.ts';
import { showMenu, getInput, pressEnterToContinue, inputExhausted } from './src/menu.ts';
import { red, yellow } from './src/colors.ts';
import { 
  handleOption1, 
  handleOption2, 
  handleOption3, 
  handleOption4, 
  handleOption5,
  handleOption6 
} from './src/cities.ts';
import { handleOption8 } from './src/settings.ts';

async function main(): Promise<void> {
  const state = await loadState();
  
  while (true) {
    if (inputExhausted()) {
      console.log(`\n  ${yellow('Entrada cerrada. Saliendo...')}\n`);
      process.exit(0);
    }

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
      case '6':
        await handleOption6(state);
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