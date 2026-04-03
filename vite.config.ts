
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  /** Figma export URLs → single on-disk asset so dev/build work without design handoff files */
  const figmaPlaceholder = path.resolve(__dirname, './src/assets/placeholder.png');
  const figmaAsset = (hash: string) => ({
    [`figma:asset/${hash}.png`]: figmaPlaceholder,
  });

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        ...figmaAsset('e60a26e7718629a129c4e7a854b1f876925c041e'),
        ...figmaAsset('e5bbcfaaf08b208473c04b5ae611365f951076ab'),
        ...figmaAsset('9b98f8fae594a5c7ded82dd6f481860709ab0a0c'),
        ...figmaAsset('6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe'),
        ...figmaAsset('597a6f6fd0bc8e57b8ac3e371a8dbde74b6a3376'),
        ...figmaAsset('31dc010aadfd329b50bb4ba98f777d3d534dbea2'),
        ...figmaAsset('c71eace56b6821982da9dde651f71e10cdc44ea3'),
        ...figmaAsset('a35b854f5d98c8fe3cc892f6e31e562c8e01b16e'),
        ...figmaAsset('e8dadf97e0ab8f9f66c37c69734ae4d5f61a1cbf'),
        ...figmaAsset('85e66e6fc21f06c64b3ef63bf38bcadc72c6bbfb'),
        ...figmaAsset('37c5cc972080f780d91709f9ee5699e2549830d5'),
        ...figmaAsset('a0fd1a064dcc12c2e2c75b6ea79e51d94e7b9c31'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@supabase/supabase-js@2.39.3': '@supabase/supabase-js',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });