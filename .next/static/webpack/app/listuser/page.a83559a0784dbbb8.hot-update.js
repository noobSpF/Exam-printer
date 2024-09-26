"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/listuser/page",{

/***/ "(app-pages-browser)/./app/listuser/page.tsx":
/*!*******************************!*\
  !*** ./app/listuser/page.tsx ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ UsersList; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"(app-pages-browser)/./node_modules/axios/lib/axios.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/./node_modules/next/dist/api/link.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\nfunction UsersList() {\n    _s();\n    const [users, setUsers] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    // Fetch data when the component mounts\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const fetchUsers = async ()=>{\n            try {\n                // Make a GET request to the Next.js API route\n                const response = await axios__WEBPACK_IMPORTED_MODULE_3__[\"default\"].get(\"/Api/getuser\");\n                setUsers(response.data); // Set the users data from the response\n            } catch (error) {\n                console.error(\"Error fetching users:\", error);\n            }\n        };\n        fetchUsers();\n    }, []); // Empty dependency array means this will only run once when the component mounts\n    if (error) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n            children: error\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n            lineNumber: 29,\n            columnNumber: 16\n        }, this);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"Users List\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n                lineNumber: 34,\n                columnNumber: 13\n            }, this),\n            users.length > 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                children: users.map((user)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                        children: [\n                            user.username,\n                            \"------\",\n                            user.Role\n                        ]\n                    }, user.UserID, true, {\n                        fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n                        lineNumber: 38,\n                        columnNumber: 25\n                    }, this) // Assuming 'name' is a field in your Users table\n                )\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n                lineNumber: 36,\n                columnNumber: 17\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: \"No users found\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n                lineNumber: 42,\n                columnNumber: 17\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_link__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                href: \"/\",\n                children: \"Go back to Home\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n                lineNumber: 46,\n                columnNumber: 13\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Pesoniq\\\\Desktop\\\\SoftwareEn\\\\Exam-printer\\\\app\\\\listuser\\\\page.tsx\",\n        lineNumber: 33,\n        columnNumber: 9\n    }, this);\n}\n_s(UsersList, \"W8dPUmt9Ai9400zDPm7RH8jUmB4=\");\n_c = UsersList;\nvar _c;\n$RefreshReg$(_c, \"UsersList\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9saXN0dXNlci9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUUwQjtBQUNHO0FBQzJCO0FBRXpDLFNBQVNLOztJQUVwQixNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR0osK0NBQVFBLENBQU0sRUFBRTtJQUMxQyxNQUFNLENBQUNLLE9BQU9DLFNBQVMsR0FBR04sK0NBQVFBLENBQUM7SUFFbkMsdUNBQXVDO0lBQ3ZDQyxnREFBU0EsQ0FBQztRQUNOLE1BQU1NLGFBQWE7WUFDZixJQUFJO2dCQUNBLDhDQUE4QztnQkFDOUMsTUFBTUMsV0FBVyxNQUFNWCw2Q0FBS0EsQ0FBQ1ksR0FBRyxDQUFDO2dCQUNqQ0wsU0FBU0ksU0FBU0UsSUFBSSxHQUFHLHVDQUF1QztZQUNwRSxFQUFFLE9BQU9MLE9BQU87Z0JBRVpNLFFBQVFOLEtBQUssQ0FBQyx5QkFBeUJBO1lBQzNDO1FBQ0o7UUFFQUU7SUFDSixHQUFHLEVBQUUsR0FBRyxpRkFBaUY7SUFFekYsSUFBSUYsT0FBTztRQUNQLHFCQUFPLDhEQUFDTztzQkFBR1A7Ozs7OztJQUNmO0lBRUEscUJBQ0ksOERBQUNROzswQkFDRyw4REFBQ0M7MEJBQUc7Ozs7OztZQUNIWCxNQUFNWSxNQUFNLEdBQUcsa0JBQ1osOERBQUNDOzBCQUNJYixNQUFNYyxHQUFHLENBQUMsQ0FBQ0MscUJBQ1IsOERBQUNDOzs0QkFBc0JELEtBQUtFLFFBQVE7NEJBQUM7NEJBQU9GLEtBQUtHLElBQUk7O3VCQUE1Q0gsS0FBS0ksTUFBTTs7Ozs2QkFBd0MsaURBQWlEOzs7Ozs7cUNBSXJILDhEQUFDVjswQkFBRTs7Ozs7OzBCQUlQLDhEQUFDZCxpREFBSUE7Z0JBQUN5QixNQUFLOzBCQUFJOzs7Ozs7Ozs7Ozs7QUFHM0I7R0ExQ3dCckI7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwL2xpc3R1c2VyL3BhZ2UudHN4PzA0MTkiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXHJcblxyXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcbmltcG9ydCBMaW5rIGZyb20gXCJuZXh0L2xpbmtcIjtcclxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIEtleSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVXNlcnNMaXN0KCkge1xyXG5cclxuICAgIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGU8YW55PihbXSk7XHJcbiAgICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICAgIC8vIEZldGNoIGRhdGEgd2hlbiB0aGUgY29tcG9uZW50IG1vdW50c1xyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBmZXRjaFVzZXJzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBhIEdFVCByZXF1ZXN0IHRvIHRoZSBOZXh0LmpzIEFQSSByb3V0ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoXCIvQXBpL2dldHVzZXJcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRVc2VycyhyZXNwb25zZS5kYXRhKTsgLy8gU2V0IHRoZSB1c2VycyBkYXRhIGZyb20gdGhlIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyB1c2VyczpcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZmV0Y2hVc2VycygpO1xyXG4gICAgfSwgW10pOyAvLyBFbXB0eSBkZXBlbmRlbmN5IGFycmF5IG1lYW5zIHRoaXMgd2lsbCBvbmx5IHJ1biBvbmNlIHdoZW4gdGhlIGNvbXBvbmVudCBtb3VudHNcclxuXHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gPHA+e2Vycm9yfTwvcD47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aDE+VXNlcnMgTGlzdDwvaDE+XHJcbiAgICAgICAgICAgIHt1c2Vycy5sZW5ndGggPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIHt1c2Vycy5tYXAoKHVzZXIpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17dXNlci5Vc2VySUR9Pnt1c2VyLnVzZXJuYW1lfS0tLS0tLXt1c2VyLlJvbGV9PC9saT4gLy8gQXNzdW1pbmcgJ25hbWUnIGlzIGEgZmllbGQgaW4geW91ciBVc2VycyB0YWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxwPk5vIHVzZXJzIGZvdW5kPC9wPlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIEFkZCBhIExpbmsgY29tcG9uZW50IGFzIGFuIGV4YW1wbGUgKi99XHJcbiAgICAgICAgICAgIDxMaW5rIGhyZWY9XCIvXCI+R28gYmFjayB0byBIb21lPC9MaW5rPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiYXhpb3MiLCJMaW5rIiwiUmVhY3QiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIlVzZXJzTGlzdCIsInVzZXJzIiwic2V0VXNlcnMiLCJlcnJvciIsInNldEVycm9yIiwiZmV0Y2hVc2VycyIsInJlc3BvbnNlIiwiZ2V0IiwiZGF0YSIsImNvbnNvbGUiLCJwIiwiZGl2IiwiaDEiLCJsZW5ndGgiLCJ1bCIsIm1hcCIsInVzZXIiLCJsaSIsInVzZXJuYW1lIiwiUm9sZSIsIlVzZXJJRCIsImhyZWYiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/listuser/page.tsx\n"));

/***/ })

});