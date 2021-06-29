var tabs = {'intro': 'https://eastriver.today', 'writings': 'https://eastriver.today/writings.html', 'works': 'https://eastriver.today/works.html'}

function select(selected) {
	var tabview = ''
	var i = 0

	for (var name in tabs) {
		tabview += `<li><a ${selected == i ? 'id="selected"' : ''} href=${tabs[name]}>${name}</a></li>`
		i++
	}
	document.getElementById('tab').innerHTML = tabview
}
