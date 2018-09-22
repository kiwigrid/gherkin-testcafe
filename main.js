import main from './src/runner';
import args from './src/args';

const { argv } = args.help();

main(argv).catch(error => console.error(error));
