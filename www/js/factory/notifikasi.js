angular.module('starter')
.factory('NotifFac',function($rootScope,$http,$q,$cordovaSQLite,UtilService)
{
	var SetNotifToLocal = function (datatosave)
    {
        var deferred        = $q.defer();
        var judul           = datatosave.judul;
        var deskripsi       = datatosave.deskripsi;
        var linkuntuk       = datatosave.linkuntuk;
        var statusbaca      = datatosave.statusbaca;

        var isitable        = [judul,deskripsi,linkuntuk,statusbaca]
        var query           = 'INSERT INTO Tbl_Notifikasi (judul,deskripsi,linkuntuk,statusbaca) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    var GetNotifikasi = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Notifikasi';
        $cordovaSQLite.execute($rootScope.db,query,[])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }
    var UpdateSudahDibaca = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var updatestatus    = 'UPDATE Tbl_Notifikasi SET statusbaca = ? WHERE id = ?';
        $cordovaSQLite.execute($rootScope.db,updatestatus,datatoupdate)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    var CountBelumDibaca = function ()
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT count(*) AS TOTAL FROM Tbl_Notifikasi WHERE statusbaca = 0';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    return {
    	SetNotifToLocal:SetNotifToLocal,
        GetNotifikasi:GetNotifikasi,
        UpdateSudahDibaca:UpdateSudahDibaca,
        CountBelumDibaca:CountBelumDibaca
    }
});