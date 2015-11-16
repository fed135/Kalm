## Classes
<dl>
<dt><a href="#Kalm">Kalm</a></dt>
<dd></dd>
<dt><a href="#Kalm">Kalm</a></dt>
<dd></dd>
</dl>
<a name="Kalm"></a>
## Kalm
**Kind**: global class  

* [Kalm](#Kalm)
  * [new Kalm()](#new_Kalm_new)
  * [new Kalm(pkg, config)](#new_Kalm_new)
  * [.registerComponent(pkg, path, callback)](#Kalm.registerComponent)
  * [.getComponent(pkgName)](#Kalm.getComponent) ⇒ <code>object</code>

<a name="new_Kalm_new"></a>
### new Kalm()
Kalm App singleton
Reference to this class will be available accross the project
under the global property K

<a name="new_Kalm_new"></a>
### new Kalm(pkg, config)
Kalm framework constructor


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>object</code> | The package file for the Kalm distribution |
| config | <code>object</code> | The app config of the Kalm project |

<a name="Kalm.registerComponent"></a>
### Kalm.registerComponent(pkg, path, callback)
Registers a component with Kalm
This makes it available accross the project

**Kind**: static method of <code>[Kalm](#Kalm)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>object</code> | The component package to register (component definition) |
| path | <code>string</code> &#124; <code>null</code> | The path where the package was found (debug) |
| callback | <code>function</code> | The callback method |

<a name="Kalm.getComponent"></a>
### Kalm.getComponent(pkgName) ⇒ <code>object</code>
Retreives a registered component

**Kind**: static method of <code>[Kalm](#Kalm)</code>  
**Returns**: <code>object</code> - The requested component  

| Param | Type | Description |
| --- | --- | --- |
| pkgName | <code>string</code> | The name of the package to retreive |

<a name="Kalm"></a>
## Kalm
**Kind**: global class  

* [Kalm](#Kalm)
  * [new Kalm()](#new_Kalm_new)
  * [new Kalm(pkg, config)](#new_Kalm_new)
  * [.registerComponent(pkg, path, callback)](#Kalm.registerComponent)
  * [.getComponent(pkgName)](#Kalm.getComponent) ⇒ <code>object</code>

<a name="new_Kalm_new"></a>
### new Kalm()
Kalm App singleton
Reference to this class will be available accross the project
under the global property K

<a name="new_Kalm_new"></a>
### new Kalm(pkg, config)
Kalm framework constructor


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>object</code> | The package file for the Kalm distribution |
| config | <code>object</code> | The app config of the Kalm project |

<a name="Kalm.registerComponent"></a>
### Kalm.registerComponent(pkg, path, callback)
Registers a component with Kalm
This makes it available accross the project

**Kind**: static method of <code>[Kalm](#Kalm)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>object</code> | The component package to register (component definition) |
| path | <code>string</code> &#124; <code>null</code> | The path where the package was found (debug) |
| callback | <code>function</code> | The callback method |

<a name="Kalm.getComponent"></a>
### Kalm.getComponent(pkgName) ⇒ <code>object</code>
Retreives a registered component

**Kind**: static method of <code>[Kalm](#Kalm)</code>  
**Returns**: <code>object</code> - The requested component  

| Param | Type | Description |
| --- | --- | --- |
| pkgName | <code>string</code> | The name of the package to retreive |

