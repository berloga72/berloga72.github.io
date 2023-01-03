function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function copyToClipboard() {
  var form_date = new Date($("#start-date-alt").val() + ' ' + $("#start-time").val());
  var start_time = form_date.getUTCHours().toString().padStart(2, '0') + form_date.getUTCMinutes().toString().padStart(2, '0');
  var start_date = form_date.getUTCFullYear().toString().slice(-2) + (form_date.getUTCMonth()+1).toString().padStart(2, '0') + form_date.getUTCDate().toString().padStart(2, '0');
  var kws_fio = $("#kws-fio").val().toUpperCase();
  var kws_f = kws_fio.split(' ')[0];
  var koord_lines = $("#koords").val().split('\n');
  var rmk = $("#rmk").val(); if (rmk != "") rmk = ' ' + rmk;
  var radio = "N/N"; if ($("#radio").is(':checked')) radio = "S/C";
  var distances = [];
  var full_distance = 0;
  $('#koords_info').val('');
  for (let i=0; i<koord_lines.length-1; i++) {
    let k1 = koord_lines[i];
    let k2 = koord_lines[i+1];
    let lat1 = k1.slice(0,2)*1 + k1.slice(2,4)/60; // Широта
    let lon1 = k1.slice(5,8)*1 + k1.slice(8,10)/60;
    let lat2 = k2.slice(0,2)*1 + k2.slice(2,4)/60;
    let lon2 = k2.slice(5,8)*1 + k2.slice(8,10)/60;
    let distance = Math.round(getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2));
    full_distance += distance;
    if (i==0)
        $('#koords_info').text("Расстояния между геоточками: " + distance);
      else {
        $('#koords_info').text($("#koords_info").text() + ' + ' + distance);
      }
  }
  $('#koords_info').text($("#koords_info").text() + ' = ' + full_distance + ' (километров)');


  var dep = koord_lines[0];
  var dest = koord_lines[koord_lines.length-1];
  var waypoints = koord_lines.slice(1,-1).join(' ');
  var altitude_fpln = $("#altitude").val().slice(0, -1).padStart(4, '0');

  var bort_type = $("#bort-type").val().trim();
  var bort_type_fpln = (bort_type != "") ? " TYP/" + bort_type.trim().toUpperCase() : "";

  var bort_type_code = $("#bort-type-code").val().trim();
  var bort_type_code_fpln = (bort_type_code != "") ? bort_type_code.toUpperCase() : "ZZZZ";

  var altn = $("#altn").val().trim();
  var altn_fpln = (altn != "") ? ' ALTN/'+altn.toUpperCase() : "";

  var radius = $("#radius").val().trim();
  var zone_field_fpln = "";
  if (radius != "") {
    zone_field_fpln = "-ZZZZM0000/M"+altitude_fpln+' /ZONA R'+radius.padStart(3, '0')+' '+dep+'/\n';
    dest = dep;
  } else {
    zone_field_fpln = '-K'+$("#speed").val().padStart(4, '0')+'M'+altitude_fpln+' '+waypoints+'\n';
  }

  var TEMPLATE = '(FPL-'+ $("#bort").val() +'-VG\n' +
  '-'+bort_type_code_fpln+'/L-'+radio+'\n' +
  '-ZZZZ' + start_time + '\n' +
  zone_field_fpln +
  '-ZZZZ'+ $("#duration").val() + '\n' +
  '-DEP/' + dep + ' DEST/' + dest + ' DOF/' + start_date + altn_fpln + ' OPR/' + kws_fio + bort_type_fpln + ' REG/RA' + $("#bort").val() + ' RMK/КВС ' + kws_f + ' +7'+$("#kws-tel").val() + rmk + ')';
  $("#fplTelegram").val(TEMPLATE);
  $("#koords_info").removeAttr('hidden');
  $("#fplTelegram").removeAttr('hidden');
  var copyText = document.getElementById("fplTelegram");
  copyText.select();
  document.execCommand("copy");
  //alert("Скопировано!");
};
