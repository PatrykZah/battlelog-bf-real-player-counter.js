Timer = setInterval(function() {
	if( typeof(serverbrowserwarsaw.serverrow.render) == "function"){
		
		console.log("init done")
		window.cached_function = serverbrowserwarsaw.serverrow.render;
		window.Req = [];
		clearInterval(Timer)
		delete Timer
		serverbrowserwarsaw.serverrow.render = (function() {
			return function() {
				var Ri = arguments[0].server.gameId;
				Req[Ri] = [new XMLHttpRequest(), arguments];
				Req[Ri][0].open("GET","https://keeper.battlelog.com/snapshot/"+arguments[0].server.guid, true);
				Req[Ri][0].send(null);
				
				Req[Ri][0].onreadystatechange = function () {
					var response=Req[Ri][0];
					var args=Req[Ri][1][0];
					var DOM=DOMserver(args.server.guid);
					//console.log("response",response,args)
					
					if (response.readyState === 4) {
						if (response.status === 200) {
							teamInfo=JSON.parse(response.responseText)["snapshot"]["teamInfo"];
							
							blog_players = args.server.slots[2].current
							total_players = 0
				
							for (i = 0; i < 4; i++) {
								total_players += [i] in teamInfo ? Object.keys(teamInfo[i].players).length : 0
							}
							
							diff = blog_players-total_players
							args.server.slots[2].current = total_players
							if (total_players<2 & blog_players>10){
								DOM.children[3].style.color="red"
							}else if (diff>5) {
								DOM.children[3].style.color="#db0"
							}else {
								DOM.children[3].style.color="green"
							}
							DOM.children[3][0]
							DOM.children[3].children[0].innerHTML = "("+total_players+")"+blog_players
						} else {
							console.log("Error", response.statusText);
						}
					}
				};
				
				
				var result = cached_function.apply(this, arguments); // use .apply() to call it

				console.log("end id: "+Ri,"guid: "+arguments[0].server.guid);
				console.log(Req[Ri]);
				return result;
			};
		})();

		function DOMserver(guid){
			
			for (DOM of serverbrowserwarsaw.tbody[0].children){
				if(DOM.dataset.guid===guid){return DOM}
			}
			return null
		}
		
	//end
	}
}, 100 )//end timer
