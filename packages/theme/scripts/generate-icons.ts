import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import { join, basename } from 'path';
import svgr from '@svgr/core';
import { pascalCase, constantCase } from 'change-case';

const iconsSvgDir = join(__dirname, '../resources/icons/');
const iconsComponentDir = join(__dirname, '../lib/components/Icon/svg/');

const AUTO_GENERATED_FILE_HEADER =
`/**
 * DO NOT MODIFY THIS FILE MANUALLY
 * This file is auto-generated via \`yarn run generate:icons\`
 */
`;

// typescript template for svgr
function template(
  { template },
  _,
  { componentName, jsx }
) {
  const typeScriptTpl = template.smart({ plugins: ['typescript'] })
  return typeScriptTpl.ast`
    ${AUTO_GENERATED_FILE_HEADER}
    ${'/* tslint:disable:max-line-length */\n'}
    import * as React from 'react';
    const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => ${jsx};
    export default ${componentName};
  `
}

// will take every `.svg` in `resources/icons`
// generate a SVG component (via svgr) for each one in `lib/components/Icon/svg/`
// generate `lib/components/Icon/svg/index.ts` with necessary import/export and enum
glob(iconsSvgDir+'*.svg', (_, files) => {
  const svgs = files.map(file => basename(file, '.svg'));

  svgs.forEach(svg => {
    const componentName = `${pascalCase(svg)}Svg`;

    const svgCode = readFileSync(join(iconsSvgDir, svg+'.svg'), 'utf8');

    const jsCode: string = svgr.sync(svgCode, {
      plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      template,
    }, {
        componentName,
    });

    writeFileSync(join(iconsComponentDir, `${componentName}.tsx`), jsCode);
  });

  const indexContent =
`${AUTO_GENERATED_FILE_HEADER}
${svgs.map(svg =>
  `import ${pascalCase(svg)}Svg from './${pascalCase(svg)}Svg';`
).join('\n')}

export enum SvgSymbol {
${svgs.map(svg =>
`  ${constantCase(svg)} = '${svg}',`
).join('\n')}
}

type SvgComponents = {
  [key in SvgSymbol]: React.SFC<React.SVGProps<SVGSVGElement>>;
};

const components: SvgComponents = {
${svgs.map(svg =>
`  [SvgSymbol.${constantCase(svg)}]: ${pascalCase(svg)}Svg,`
).join('\n')}
};

export default components;
`;
  
  writeFileSync(join(iconsComponentDir, 'index.ts'), indexContent);

  console.log(`Generated ${svgs.length} svg components.`)
});
