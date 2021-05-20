/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var map = new Map();
export var setState = function (state) {
    map.set('oauth_state', state);
};
export var getState = function () {
    var oauth_state = map.get('oauth_state');
    map.delete('oauth_state');
    return oauth_state;
};
export var setPKCE = function (private_key) {
    map.set('ouath_pkce_key', private_key);
};
export var getPKCE = function () {
    var ouath_pkce_key = map.get('ouath_pkce_key');
    map.delete('ouath_pkce_key');
    return ouath_pkce_key;
};
export var clearAll = function () {
    map.delete('ouath_pkce_key');
    map.delete('oauth_state');
};
//# sourceMappingURL=oauthStorage.js.map