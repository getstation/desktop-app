# Station Theme
[![Build Status](https://travis-ci.com/getstation/theme.svg?branch=master)](https://travis-ci.com/getstation/theme)

## TL;DR

```
npm install @getstation/theme
```

## Usage
https://getstation.github.io/theme/storybook/index.html

## TypeScript
https://getstation.github.io/theme/typedoc/index.html

## How to add an icon
- Add the SVG icon in `resources/icons` with param-case filename. Example: `indian-pale-ale.svg`.
- Run `yarn run generate:icons`
- Commit SVG resource and generated files in `lib/components/Icon/svg`
- Use the new icon via: `<Icon symbolId={SvgSymbol.INDIAN_PALE_ALE} />`

## Dev

#### Requirement for developpement usage

To work with storybook inside Bx you will need to link the module 

- `git clone http://github.com/getstation/theme`
- `cd theme`
- `yarn`
- `yarn link`
- `cd /path/to/my/Bx`
- `yarn link @getstation/theme`

#### Storybook

You can see modifications to you components inside `storybook`, just start it `yarn run storybook` & go to [localhost](http://localhost:6006)


#### Expose modifications to BX

Rebuild `@getstation/theme` via `yarn run build` inside the repo everytime you did change in `theme` 

#### Pull request

Create a RC version for your PR to be tested:

- `npm version --preid=rc --prerelease ` for a new or increment RC, will result in **0.0.0-rc-0**
- `npm version --premajor` for a new major RC version, will result in **1.0.0-rc.0**
- `npm version --preminor` for a new minor RC version, will result in **0.1.0-rc.0**
- `npm version --prepatch` for a new patched version, will result in **0.0.1-rc.0** 
- `git push --follow-tags` to push rc version version

## Publish
- Build docs: `yarn build-docs`
- verify `CHANGELOG.md` entries
- Increment version via: from **0.0.0**
  - `npm version --major` => **1.0.0**
  - `npm version --minor` => **0.1.0**
  - `npm version --patch` => **0.0.1**
  - NB: if the version was a *RC* those command will automatically chaned it a release one with same version !👌
- Publish: `npm publish`
