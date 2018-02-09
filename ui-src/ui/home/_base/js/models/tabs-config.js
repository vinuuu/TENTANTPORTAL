//  Workspaces Config Model

(function(angular, undefined) {
    "use strict";

    function factory($state, moment) {
        var model = {};

        model.error = function(response) {
            $state.go("error", {
                errorCode: response.status
            });

        };


        model.submitLoginInput = function(username, pwd) {
            return {
                "request": {
                    "operation": {
                        "authentication": {
                            "login": {
                                "userid": username,
                                "password": pwd
                            }
                        },
                        "content": {
                            "function": {
                                "getTPAPISession": {}
                            }
                        }
                    }
                }
            };

        };
        model.resetpwdSubmitInput = function(pwd1, pwd2, oldPwd, securityquestion, security_a) {
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getchangepwd": {
                                    "pwdtype": "login",
                                    "newpwd": pwd1,
                                    "oldpwd": oldPwd,
                                    "cnfrmpwd": pwd2,
                                    "secquestion": securityquestion,
                                    "secanswer": security_a
                                }
                            }
                        }
                    }
                }
            };
        };


        model.checkUserNameInput = function(u_e_id) {

            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "question",
                                    "userid": u_e_id
                                }
                            }
                        }
                    }
                }
            };

        };
        model.answerSecurityQusnInput = function(strUserName, securityQusn, question1) {

            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "authcode",
                                    "userid": strUserName,
                                    "secquestion": securityQusn,
                                    "secanswer": question1
                                }
                            }
                        }
                    }
                }
            };

        };

        model.checkSixDigitCodeInput = function(strUserName, emailCode) {
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "validateauthcode",
                                    "userid": strUserName,
                                    "authcode": emailCode
                                }
                            }
                        }
                    }
                }
            };

        };
        model.forgotpwdSubmitInput = function(strUserName, emailCode, userToken, pwd1, pwd2) {

            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "changepassword",
                                    "userid": strUserName,
                                    "authcode": emailCode,
                                    "usertoken": userToken,
                                    "newpwd": pwd1,
                                    "cnfrmpwd": pwd2
                                }
                            }
                        }
                    }
                }
            };

        };

        model.LeaseIDBinding = function() {

            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "leaseoccupancy",
                                    "fields": "",
                                    "query": "",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

        };
        model.AccountsInput = function(leaseid) {
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getTenantBalance": {
                                    "leaseid": leaseid,
                                    "asofdate": {
                                        "year": moment().format('YYYY'),
                                        "month": moment().format('MM'),
                                        "day": (moment().format('DD'))
                                    }
                                }
                            }
                        }
                    }
                }
            };

        };

        model.invoiceListInput = function(leaseid) {
            var leaseID = leaseid === undefined ? '' : "(LEASEID = '" + leaseid + "')";
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    "query": leaseID,
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

        };

        model.invoiceListWithDateInput = function(leaseid, date) {
            // var leaseID = leaseid === undefined ? '' : "(LEASEID = '" + leaseid + "')";
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    // "query": leaseID,
                                    "query": "(leaseid = '" + leaseid + "' AND TRX_TOTALDUE = 0 AND TRX_TOTALENTERED NOT IN '0' AND WHENCREATED >= '" + date + "' )",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

        };
        model.invoiceListWithDateInputNoLeaseID = function(date) {
            // var leaseID = leaseid === undefined ? '' : "(LEASEID = '" + leaseid + "')";
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    // "query": leaseID,
                                    "query": "(TRX_TOTALDUE = 0 AND TRX_TOTALENTERED NOT IN '0' AND WHENCREATED <= '" + date + "' )",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

        };
        
        model.invoiceListWithDateInputNoLeaseIDinPayments = function(leaseid,date) {
            var leaseID = leaseid === '' || leaseid === undefined ? '' : "LEASEID = '" + leaseid + "'";
            var dateQuery = date === '' || date === undefined ? '' : " WHENCREATED  >= '" + date + "' and WHENCREATED &lt;= '"+ moment().format('MM/DD/YYYY')+ "'";
            var transcation="((TRX_TOTALDUE = 0 AND TRX_TOTALENTERED NOT IN '0') OR (TRX_TOTALPAID NOT IN '0' AND TRX_TOTALDUE NOT IN '0'))";
            var query = ((leaseID.length > 2 && transcation.length > 2) ? leaseID + ' AND ' : leaseID) + transcation;
            query = dateQuery.length>2 ?(query.length > 2? query+ ' AND '+dateQuery: dateQuery):query;
            query = query.length > 2 ? "(" + query + ")" : query;
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    // "query": leaseID,
                                    "query": query,
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };
        };

        //all for empty,paid ofr paid,due for paymtn for due
        model.invoiceListTransactionInput = function(leaseid, transcation,date) {
            var tenantname = sessionStorage.getItem("tenantname");
            var leaseID = leaseid === '' || leaseid === undefined ? '' : "LEASEID = '" + leaseid + "'";
            var dateQuery = date === '' || date === undefined ? '' : " WHENCREATED  >= '" + date + "' and WHENCREATED &lt;= '"+ moment().format('MM/DD/YYYY')+ "'";
            transcation = transcation === '' ? '' : transcation === 'Paid' ?
                "customerid = '" + tenantname + "' AND TRX_TOTALDUE = 0 AND TRX_TOTALENTERED NOT IN '0'" : " customerid = '" + tenantname + "' AND TRX_TOTALPAID = '0' AND TRX_TOTALSELECTED = 0";
            var query = ((leaseID.length > 2 && transcation.length > 2) ? leaseID + ' AND ' : leaseID) + transcation;
            query = dateQuery.length>2 ?(query.length > 2? query+ ' AND '+dateQuery: dateQuery):query;
            query = query.length > 2 ? "(" + query + ")" : query;
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    "query": query,
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

        };




        model.statementInput = function(leaseId, dateRange) {
            return {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getTenantStatement": {
                                    "leaseid": leaseId,
                                    "fromdate": {
                                        "year": moment(dateRange).format('YYYY'),
                                        "month": moment(dateRange).format('MM'),
                                        "day": "01"
                                    },
                                    "todate": {
                                        "year": moment().format('YYYY'),
                                        "month": moment().format('MM'),
                                        "day": moment().format('DD')
                                    }
                                }
                            }
                        }
                    }
                }
            };

        };





        return model;
    }

    angular
        .module("ui")
        .factory("baseModel", ["$state", "moment", factory]);
})(angular);