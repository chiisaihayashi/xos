/* This is an example that uses xoslib + datatables to display the developer







    var actualEntries = [];

    for (rowkey in data.models) {
        row = data.models[rowkey];
        slicename = row.get("name");
        sliceid = row.get("id");
        role = row.get("sliceInfo").roles[0];
        slivercount = row.get("sliceInfo").sliverCount;
        sitecount = row.get("sliceInfo").siteCount;

        if (! role) {
            continue;
        }

        actualEntries.push(['<a href="/admin/core/slice/' + sliceid + '">' + slicename + '</a>',
                            role, slivercount, sitecount]);
    }
    oTable = $('#dynamicusersliceinfo').dataTable( {
        "bJQueryUI": true,
        "aaData":  actualEntries ,
        "bStateSave": true,
        "aoColumns": [
            { "sTitle": "Slice" },
            { "sTitle": "Privilege" , sClass: "alignCenter"},
            { "sTitle": "Number of Slivers" , sClass: "alignCenter"},
            { "sTitle": "Number of Sites" , sClass: "alignCenter"},
        ]
    } );
}

$(document).ready(function(){
    xos.slicesPlus.on("change", function() { /*console.log("change");*/ updateSliceTable(xos.slicesPlus); });
    xos.slicesPlus.on("remove", function() { /*console.log("sort");*/ updateSliceTable(xos.slicesPlus); });
    xos.slicesPlus.on("sort", function() { /*console.log("sort");*/ updateSliceTable(xos.slicesPlus); });

    xos.slicesPlus.startPolling();
});
