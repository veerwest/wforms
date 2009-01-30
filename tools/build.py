#!/usr/bin/env python

import os, re

branch = os.path.abspath(os.path.dirname(__file__) +'/..')

head = '''/* wForms %s
A javascript extension to web forms.

Copyright (c) 2005-2007 Cedric Savarese <cedric@veerwest.com> and contributors.
This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
For more information, visit: http://www.formassembly.com/wForms

wForms version 3.0 by Demid Nikitin and Cedric Savarese.
wForms 3.0 requires base2 - copyright 2007, Dean Edwards. */'''

base2_version = "beta2";

modules = (
	'lib/base2/'+base2_version+'/src/base2.js',
	'lib/base2/'+base2_version+'/src/base2-dom.js',
	'wforms_core.js',
	'wforms_hint.js',
	'wforms_paging.js',
	'wforms_repeat.js',
	'wforms_switch.js',
	'wforms_validation.js',
	'wforms_calculation.js'
)

compilation = []
for module in modules:
	f = open(branch +'/'+ module)
	compilation.append(f.read().strip())
	f.close()

m = re.search('wFORMS\.VERSION\s+=\s+"([^"]+)";', compilation[2])
compilation = [head % m.group(1)] + compilation

wforms = open(branch +'/build/wforms.js', 'w')
print 'Writing '+ wforms.name
wforms.write("\n\n".join(compilation))
wforms.close()
