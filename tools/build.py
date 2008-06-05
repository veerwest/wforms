#!/usr/bin/env python

import os
from jsmin import jsmin

branch = os.path.abspath(os.path.dirname(__file__) +'/..')

modules = [
	'lib/src/base2.js',
	'lib/src/base2-dom.js',
	'wforms_core.js',
	'wforms_hint.js',
	'wforms_paging.js',
	'wforms_repeat.js',
	'wforms_switch.js',
	'wforms_validation.js',
	'wforms_calculation.js'
]

compilation = []
for module in modules:
	f = open(branch +'/'+ module)
	compilation.append(f.read())
	f.close()

wforms = open(branch +'/build/wforms.js', 'w')
print 'Writing '+ wforms.name
wforms.write(jsmin("\n\n".join(compilation)))
wforms.close()
