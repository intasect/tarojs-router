import Taro, { getCurrentInstance, useRouter as useRouter$1 } from '@tarojs/taro';
import compose from 'koa-compose';
import { useEffect } from 'react';

var ROUTE_KEY = 'route_key';
var NavigateType;

(function (NavigateType) {
  NavigateType[NavigateType["navigateTo"] = 0] = "navigateTo";
  NavigateType[NavigateType["redirectTo"] = 1] = "redirectTo";
  NavigateType[NavigateType["reLaunch"] = 2] = "reLaunch";
  NavigateType[NavigateType["switchTab"] = 3] = "switchTab";
})(NavigateType || (NavigateType = {}));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function objectToUrlParams(data) {
  var _result = [];

  var _loop = function _loop(key) {
    var value = data[key];
    if (value === undefined || value === null) return "continue";

    if (value.constructor == Array) {
      value.forEach(function (_value) {
        _result.push(key + '=' + _value);
      });
    } else {
      _result.push(key + '=' + value);
    }
  };

  for (var key in data) {
    var _ret = _loop(key);

    if (_ret === "continue") continue;
  }

  return _result.join('&');
}
function getCurrentRouteKey() {
  var _Taro$getCurrentInsta;

  var params = (_Taro$getCurrentInsta = Taro.getCurrentInstance().router) === null || _Taro$getCurrentInsta === void 0 ? void 0 : _Taro$getCurrentInsta.params;
  if (!params || !params[ROUTE_KEY]) return '';
  return params[ROUTE_KEY] + '';
}
function formatPath(route, params) {
  var url = route.url;
  var paramsStr = objectToUrlParams(params);
  url = route.url + "?" + paramsStr;
  return url;
}

var PageData = /*#__PURE__*/function () {
  function PageData() {}

  PageData.getPageData = function getPageData(default_data) {
    var route_key = getCurrentRouteKey();
    var result = PageData._pageData.get(route_key) || default_data;
    return result;
  };

  PageData.delPageData = function delPageData() {
    var route_key = getCurrentRouteKey();

    PageData._pageData["delete"](route_key);
  };

  PageData.getPagePromise = function getPagePromise() {
    var route_key = getCurrentRouteKey();
    return PageData._pagePromise.get(route_key);
  };

  PageData.delPagePromise = function delPagePromise() {
    var route_key = getCurrentRouteKey();

    PageData._pagePromise["delete"](route_key);
  };

  PageData.setPageData = function setPageData(route_key, data) {
    this._pageData.set(route_key, data);
  };

  PageData.setPagePromise = function setPagePromise(route_key, options) {
    this._pagePromise.set(route_key, options);
  };

  PageData.emitBack = function emitBack() {
    var pme = PageData.getPagePromise();
    if (!pme) return;
    var route_key = getCurrentRouteKey();

    var err = PageData._backErr.get(route_key);

    var data = PageData._backData.get(route_key);

    PageData.delPageData();
    PageData.delPagePromise();

    if (err) {
      PageData._backErr["delete"](route_key);

      pme.rej(err);
    } else if (data) {
      PageData._backData["delete"](route_key);

      pme.res(data);
    } else {
      pme.res(null);
    }
  };

  PageData.setBackData = function setBackData(data) {
    var route_key = getCurrentRouteKey();

    PageData._backData.set(route_key, data);
  };

  PageData.setBackError = function setBackError(err) {
    var route_key = getCurrentRouteKey();

    PageData._backErr.set(route_key, err);
  };

  return PageData;
}();
PageData._pageData = new Map();
PageData._pagePromise = new Map();
PageData._backErr = new Map();
PageData._backData = new Map();

var Router = /*#__PURE__*/function () {
  function Router() {}

  Router.config = function config(_config) {
    Router._config = _config;
  };

  Router.navigate = function navigate(route, options) {
    try {
      var _Router$_config;

      options = _extends({}, {
        type: NavigateType.navigateTo,
        params: {}
      }, options);
      if (options.params[ROUTE_KEY]) throw Error('params 中 route_key 为保留字段，请用其他名称');
      var route_key = options.params[ROUTE_KEY] = Date.now() + '';

      if (options.data) {
        PageData.setPageData(route_key, options.data);
      }

      var middlewares = [].concat(((_Router$_config = Router._config) === null || _Router$_config === void 0 ? void 0 : _Router$_config.middlewares) || [], route.beforeRouteEnter || []);
      var fn = compose(middlewares);
      return Promise.resolve(fn({
        route: route,
        params: options.params
      })).then(function () {
        var url = formatPath(route, options.params);
        return new Promise(function (res, rej) {
          PageData.setPagePromise(route_key, {
            res: res,
            rej: rej
          });

          switch (options.type) {
            case NavigateType.reLaunch:
              Taro.reLaunch({
                url: url
              });
              break;

            case NavigateType.redirectTo:
              Taro.redirectTo({
                url: url
              });
              break;

            case NavigateType.switchTab:
              Taro.switchTab({
                url: url
              });
              break;

            default:
              Taro.navigateTo({
                url: url
              });
              break;
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Router.back = function back(route) {
    var _Router$_config2;

    var currentPages = Taro.getCurrentPages();

    if (currentPages.length > 1) {
      return Taro.navigateBack();
    }

    route = route || ((_Router$_config2 = Router._config) === null || _Router$_config2 === void 0 ? void 0 : _Router$_config2.backRootRoute);

    if (route) {
      return Router.navigate(route, {
        type: NavigateType.redirectTo
      });
    } else {
      console.error('没有页面可以回退了');
      return Promise.resolve();
    }
  };

  Router.emitBack = function emitBack() {
    PageData.emitBack();
  };

  Router.getData = function getData(default_data) {
    return PageData.getPageData(default_data);
  };

  Router.backData = function backData(data) {
    PageData.setBackData(data);
    return Router.back();
  };

  Router.backError = function backError(err) {
    PageData.setBackError(err);
    return Router.back();
  };

  return Router;
}();

function useRouter(defaultParams) {
  useEffect(function () {
    var instance = getCurrentInstance();
    if (!instance.page) return;
    var routerEmit = instance.page['routerEmit'];
    if (routerEmit) return;
    instance.page['routerEmit'] = true;
    var originOnUnload = instance.page.onUnload;

    instance.page.onUnload = function () {
      originOnUnload();
      Router.emitBack();
    };
  }, []);

  var _useRouterTaro = useRouter$1(),
      params = _useRouterTaro.params;

  var data = Router.getData();
  return {
    params: _extends({}, defaultParams, params),
    data: data,
    backData: Router.backData,
    backError: Router.backError,
    back: Router.back
  };
}

function RouterEmit(target) {
  var originComponentWillUnmount = target.prototype.componentWillUnmount;

  target.prototype.componentWillUnmount = function () {
    originComponentWillUnmount && originComponentWillUnmount();
    Router.emitBack();
  };

  return target;
}

export { NavigateType, ROUTE_KEY, Router, RouterEmit, useRouter };
//# sourceMappingURL=index.modern.js.map
