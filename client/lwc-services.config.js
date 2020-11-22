// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    resources: [
        { from: 'src/resources/', to: 'dist/resources/' },
        { from: 'src/index.html', to: 'dist/' },
        { from: 'src/manifest.json', to: 'dist/' },
        { from: 'src/pushSW.js', to: 'dist/pushSW.js' },
        { from: 'node_modules/@salesforce-ux/design-system/assets/styles',
          to: 'dist/resources/SLDS/assets/styles'
        },
        { from: 'node_modules/@salesforce-ux/design-system/assets/fonts',
          to: 'dist/resources/SLDS/assets/fonts'
        },
        { from: 'node_modules/@salesforce-ux/design-system/assets/icons/utility-sprite',
          to: 'dist/resources/SLDS/assets/icons/utility-sprite'
        }
    ]
};
