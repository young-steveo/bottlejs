module.exports = function(grunt) {
    grunt.registerTask('bump', 'Bump the version number in bower.json and package.json', function() {
        var tag = grunt.option('tag');
        if (!tag) {
            grunt.fatal('Must provide `tag` param.');
            return false;
        }
        ['bower.json', 'package.json'].forEach(function(filename) {
            var data = grunt.file.readJSON(filename);
            data.version = tag;
            grunt.file.write(filename, JSON.stringify(data, null, 2));
        });
    });
};
