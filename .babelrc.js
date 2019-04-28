module.exports = {
    plugins: ["@babel/plugin-syntax-dynamic-import"],
    presets: [
        ['@babel/preset-env', {
            debug: true,
            targets: {
                browsers: ['> 1%', 'not IE < 12']
            }
        }]
    ]
};