

actorApp.factory("min2HourStr", function ($log) {

    function convMin2HourStr(minutes) {
        var hours = Math.floor(minutes/60);
        var mins = minutes%60;

        return ("" + hours + "h " + mins +"m");
    }

    return { convMin2HourStr : convMin2HourStr}
});