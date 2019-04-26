module.exports = {
    plugins: ["@babel/plugin-syntax-dynamic-import"],
    presets: [
        ['@babel/preset-env', {
            debug: true,
            targets: {
                browsers: ['> 2%', 'not IE < 12']
            }
        }]
    ]
};