appResource.factory('User', ["$resource", "env", function ($resource, env) {
    var url,
        id;
    if ('development' === env) {
        url = '/public/data/:id';
        id = 'getme.json';
    } else {
        url = '/api/users/:id/:controller';
        id = 'me'
    }
    var userResource = $resource(url, {
        id: '@_id'
    }, {
        get: {
            method: 'GET',
            params: {
                id: id
            }
        }
    });

    return {
        get: userResource.get
    };
}]);
