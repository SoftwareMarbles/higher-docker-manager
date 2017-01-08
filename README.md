
##### NOTE: README.md is automatically generated from README.hbs

# higher-docker-manager

Docker management package with higher-level functions

## API

## Modules

<dl>
<dt><a href="#module_HigherDockerManager">HigherDockerManager</a></dt>
<dd></dd>
</dl>


<a name="module_HigherDockerManager"></a>

## HigherDockerManager

* [HigherDockerManager](#module_HigherDockerManager)
    * [~HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)
        * [.pullImage(auth, name, tag)](#module_HigherDockerManager..HigherDockerManager.pullImage) ⇒ <code>Promise</code>
        * [.getOwnContainer()](#module_HigherDockerManager..HigherDockerManager.getOwnContainer) ⇒ <code>Promise</code>
        * [.getContainersInNetworks(networks)](#module_HigherDockerManager..HigherDockerManager.getContainersInNetworks) ⇒ <code>Promise</code>
        * [.createVolume(params)](#module_HigherDockerManager..HigherDockerManager.createVolume) ⇒ <code>Promise</code>
        * [.createContainer(params)](#module_HigherDockerManager..HigherDockerManager.createContainer) ⇒ <code>Promise</code>
        * [.createNetwork(params)](#module_HigherDockerManager..HigherDockerManager.createNetwork) ⇒ <code>Promise</code>
        * [.getVolumesForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getVolumesForLabel) ⇒ <code>Promise</code>
        * [.getNetworksForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getNetworksForLabel) ⇒ <code>Promise</code>
        * [.getNetworkForNameOrId(nameOrId)](#module_HigherDockerManager..HigherDockerManager.getNetworkForNameOrId) ⇒ <code>Promise</code>
        * [.runTemporaryContainer(params)](#module_HigherDockerManager..HigherDockerManager.runTemporaryContainer) ⇒ <code>Promise</code>
        * [.runContainer(params)](#module_HigherDockerManager..HigherDockerManager.runContainer) ⇒ <code>Promise</code>
        * [.getContainerForNameOrId(nameOrId)](#module_HigherDockerManager..HigherDockerManager.getContainerForNameOrId) ⇒ <code>Promise</code>
        * [.findContainerForNameOrId(containers, nameOrId)](#module_HigherDockerManager..HigherDockerManager.findContainerForNameOrId) ⇒ <code>container</code>
        * [.findObjectForNameOrId(objects, nameOrId)](#module_HigherDockerManager..HigherDockerManager.findObjectForNameOrId) ⇒ <code>object</code>
        * [.getContainersForImage(imageName)](#module_HigherDockerManager..HigherDockerManager.getContainersForImage) ⇒ <code>Promise</code>
        * [.filterContainersByImage(containers, imageName)](#module_HigherDockerManager..HigherDockerManager.filterContainersByImage) ⇒ <code>Array</code>
        * [.getContainersForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getContainersForLabel) ⇒ <code>Promise</code>
        * [.filterObjectsByLabel(objects, labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.filterObjectsByLabel) ⇒ <code>Array</code>
        * [.execInContainer(container, params)](#module_HigherDockerManager..HigherDockerManager.execInContainer) ⇒ <code>Promise</code>
        * [.containerOutputBuffersToString(buffers)](#module_HigherDockerManager..HigherDockerManager.containerOutputBuffersToString) ⇒ <code>string</code>

<a name="module_HigherDockerManager..HigherDockerManager"></a>

### HigherDockerManager~HigherDockerManager
<p>HigherDockerManager class offers functions to manage docker images, volumes and
containers.</p>

**Kind**: inner class of <code>[HigherDockerManager](#module_HigherDockerManager)</code>  

* [~HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)
    * [.pullImage(auth, name, tag)](#module_HigherDockerManager..HigherDockerManager.pullImage) ⇒ <code>Promise</code>
    * [.getOwnContainer()](#module_HigherDockerManager..HigherDockerManager.getOwnContainer) ⇒ <code>Promise</code>
    * [.getContainersInNetworks(networks)](#module_HigherDockerManager..HigherDockerManager.getContainersInNetworks) ⇒ <code>Promise</code>
    * [.createVolume(params)](#module_HigherDockerManager..HigherDockerManager.createVolume) ⇒ <code>Promise</code>
    * [.createContainer(params)](#module_HigherDockerManager..HigherDockerManager.createContainer) ⇒ <code>Promise</code>
    * [.createNetwork(params)](#module_HigherDockerManager..HigherDockerManager.createNetwork) ⇒ <code>Promise</code>
    * [.getVolumesForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getVolumesForLabel) ⇒ <code>Promise</code>
    * [.getNetworksForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getNetworksForLabel) ⇒ <code>Promise</code>
    * [.getNetworkForNameOrId(nameOrId)](#module_HigherDockerManager..HigherDockerManager.getNetworkForNameOrId) ⇒ <code>Promise</code>
    * [.runTemporaryContainer(params)](#module_HigherDockerManager..HigherDockerManager.runTemporaryContainer) ⇒ <code>Promise</code>
    * [.runContainer(params)](#module_HigherDockerManager..HigherDockerManager.runContainer) ⇒ <code>Promise</code>
    * [.getContainerForNameOrId(nameOrId)](#module_HigherDockerManager..HigherDockerManager.getContainerForNameOrId) ⇒ <code>Promise</code>
    * [.findContainerForNameOrId(containers, nameOrId)](#module_HigherDockerManager..HigherDockerManager.findContainerForNameOrId) ⇒ <code>container</code>
    * [.findObjectForNameOrId(objects, nameOrId)](#module_HigherDockerManager..HigherDockerManager.findObjectForNameOrId) ⇒ <code>object</code>
    * [.getContainersForImage(imageName)](#module_HigherDockerManager..HigherDockerManager.getContainersForImage) ⇒ <code>Promise</code>
    * [.filterContainersByImage(containers, imageName)](#module_HigherDockerManager..HigherDockerManager.filterContainersByImage) ⇒ <code>Array</code>
    * [.getContainersForLabel(labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.getContainersForLabel) ⇒ <code>Promise</code>
    * [.filterObjectsByLabel(objects, labelName, labelValue)](#module_HigherDockerManager..HigherDockerManager.filterObjectsByLabel) ⇒ <code>Array</code>
    * [.execInContainer(container, params)](#module_HigherDockerManager..HigherDockerManager.execInContainer) ⇒ <code>Promise</code>
    * [.containerOutputBuffersToString(buffers)](#module_HigherDockerManager..HigherDockerManager.containerOutputBuffersToString) ⇒ <code>string</code>

<a name="module_HigherDockerManager..HigherDockerManager.pullImage"></a>

#### HigherDockerManager.pullImage(auth, name, tag) ⇒ <code>Promise</code>
<p>Registers image with the given name and tag with Docker.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise returning pulled image</p>  

| Param | Type | Description |
| --- | --- | --- |
| auth | <code>Object</code> | <p>Authentication structure per Docker API documentation</p> |
| name | <code>string</code> | <p>Name of the image to be pulled from Docker registry. This may contain the tag as well in which case the actual passed <code>tag</code> param will be ignored.</p> |
| tag | <code>string</code> | <p>Tag of the image to be pulled from Docker registry</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getOwnContainer"></a>

#### HigherDockerManager.getOwnContainer() ⇒ <code>Promise</code>
<p>Returns container in which the process is running. If the process is not in a container
then null is returned.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with the process's container or null.</p>  
<a name="module_HigherDockerManager..HigherDockerManager.getContainersInNetworks"></a>

#### HigherDockerManager.getContainersInNetworks(networks) ⇒ <code>Promise</code>
<p>Returns containers that are on the given networks.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with array of matching containers which may be empty.</p>  

| Param | Type | Description |
| --- | --- | --- |
| networks | <code>Array</code> &#124; <code>Object</code> | <p>Array of network names or Networks Docker JSON as returned by <code>status</code> function.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.createVolume"></a>

#### HigherDockerManager.createVolume(params) ⇒ <code>Promise</code>
<p>Creates a new volume with the given params.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with created volume object.</p>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>Paraters of the volume to be created per Docker API.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.createContainer"></a>

#### HigherDockerManager.createContainer(params) ⇒ <code>Promise</code>
<p>Creates a new container with the given params.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with created container object.</p>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>Paraters of the container to be created per Docker API.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.createNetwork"></a>

#### HigherDockerManager.createNetwork(params) ⇒ <code>Promise</code>
<p>Creates a new network with the given params.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with created container object.</p>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>Paraters of the network to be created per Docker API.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getVolumesForLabel"></a>

#### HigherDockerManager.getVolumesForLabel(labelName, labelValue) ⇒ <code>Promise</code>
<p>Searches for all the volumes with the given label name and value.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with the array of found volumes.</p>  

| Param | Type | Description |
| --- | --- | --- |
| labelName | <code>string</code> | <p>The name of the label which we are searching.</p> |
| labelValue | <code>string</code> | <p>The value of the lable which we are searching.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getNetworksForLabel"></a>

#### HigherDockerManager.getNetworksForLabel(labelName, labelValue) ⇒ <code>Promise</code>
<p>Searches for all the networks with the given label name and value.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with the array of found volumes.</p>  

| Param | Type | Description |
| --- | --- | --- |
| labelName | <code>string</code> | <p>The name of the label which we are searching.</p> |
| labelValue | <code>string</code> | <p>The value of the lable which we are searching.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getNetworkForNameOrId"></a>

#### HigherDockerManager.getNetworkForNameOrId(nameOrId) ⇒ <code>Promise</code>
<p>Searches for the network with the given name or ID.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise returning the found network if any</p>  

| Param | Type | Description |
| --- | --- | --- |
| nameOrId | <code>string</code> | <p>The name or ID of the network for which we are searching</p> |

<a name="module_HigherDockerManager..HigherDockerManager.runTemporaryContainer"></a>

#### HigherDockerManager.runTemporaryContainer(params) ⇒ <code>Promise</code>
<p>Runs a temporary container with the given parameters, waits for its execution
to end and returns its output as an array of buffers.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Primise returning the output of the run in an array of buffers.</p>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>Parameters with which to run a temporary container</p> |

<a name="module_HigherDockerManager..HigherDockerManager.runContainer"></a>

#### HigherDockerManager.runContainer(params) ⇒ <code>Promise</code>
<p>Runs container with the given parameters.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise fulfilled once new container has been started.</p>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>Parameters for running a new container.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getContainerForNameOrId"></a>

#### HigherDockerManager.getContainerForNameOrId(nameOrId) ⇒ <code>Promise</code>
<p>Searches for the container with the given name or ID.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise returning the found container if any</p>  

| Param | Type | Description |
| --- | --- | --- |
| nameOrId | <code>string</code> | <p>The name or ID of the container for which we are searching</p> |

<a name="module_HigherDockerManager..HigherDockerManager.findContainerForNameOrId"></a>

#### HigherDockerManager.findContainerForNameOrId(containers, nameOrId) ⇒ <code>container</code>
<p>Finds the container with the given name or ID in the given containers collection.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>container</code> - <p>Found container if it was found, otherwise <code>null</code>.</p>  

| Param | Type | Description |
| --- | --- | --- |
| containers | <code>Array</code> | <p>Array of containers in which to try to find the container.</p> |
| nameOrId | <code>string</code> | <p>The name or ID of the container for which we are searching.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.findObjectForNameOrId"></a>

#### HigherDockerManager.findObjectForNameOrId(objects, nameOrId) ⇒ <code>object</code>
<p>Finds the object with the given name or ID in the given collection. Note that this
function doesn't work for containers as they can have more than one name. Use
<code>findContainerForNameOrId</code> for containers.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>object</code> - <p>Found object if it was found, otherwise <code>null</code>.</p>  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array</code> | <p>Array of objects in which to try to find the object.</p> |
| nameOrId | <code>string</code> | <p>The name or ID of the object for which we are searching.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getContainersForImage"></a>

#### HigherDockerManager.getContainersForImage(imageName) ⇒ <code>Promise</code>
<p>Searches for all the containers with the given image name.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with the array of matching containers.</p>  

| Param | Type | Description |
| --- | --- | --- |
| imageName | <code>string</code> | <p>The name of the image including the tag for which we are searching</p> |

<a name="module_HigherDockerManager..HigherDockerManager.filterContainersByImage"></a>

#### HigherDockerManager.filterContainersByImage(containers, imageName) ⇒ <code>Array</code>
<p>Filters all containers with the given image name in the given collection of containers.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Array</code> - <p>Array of matching containers.</p>  

| Param | Type | Description |
| --- | --- | --- |
| containers | <code>Array</code> | <p>Array of containers which is being filtered.</p> |
| imageName | <code>string</code> | <p>The name of the image including the tag for which we are searching</p> |

<a name="module_HigherDockerManager..HigherDockerManager.getContainersForLabel"></a>

#### HigherDockerManager.getContainersForLabel(labelName, labelValue) ⇒ <code>Promise</code>
<p>Searches for all the containers with the given label name and value</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise resolving with the array of found containers.</p>  

| Param | Type | Description |
| --- | --- | --- |
| labelName | <code>string</code> | <p>The name of the label which we are searching</p> |
| labelValue | <code>string</code> | <p>The value of the lable which we are searching</p> |

<a name="module_HigherDockerManager..HigherDockerManager.filterObjectsByLabel"></a>

#### HigherDockerManager.filterObjectsByLabel(objects, labelName, labelValue) ⇒ <code>Array</code>
<p>Filters all the objects with the given label name and value in the given collection of
objects.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Array</code> - <p>Array of matching objects.</p>  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array</code> | <p>Array of objects which is being filtered.</p> |
| labelName | <code>string</code> | <p>The name of the label which we are filtering.</p> |
| labelValue | <code>string</code> | <p>The value of the lable which we are filtering.</p> |

<a name="module_HigherDockerManager..HigherDockerManager.execInContainer"></a>

#### HigherDockerManager.execInContainer(container, params) ⇒ <code>Promise</code>
<p>Executes a command in an already running container.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>Promise</code> - <p>Promise returning the output of the execution</p>  

| Param | Type | Description |
| --- | --- | --- |
| container | <code>Container</code> | <p>Docker container object on which to execute the command</p> |
| params | <code>object</code> | <p>Parameters of the execution</p> |

<a name="module_HigherDockerManager..HigherDockerManager.containerOutputBuffersToString"></a>

#### HigherDockerManager.containerOutputBuffersToString(buffers) ⇒ <code>string</code>
<p>Converts container output buffers into a string.</p>

**Kind**: static method of <code>[HigherDockerManager](#module_HigherDockerManager..HigherDockerManager)</code>  
**Returns**: <code>string</code> - <p>String joined out of output extracted from the given buffers.</p>  

| Param | Type | Description |
| --- | --- | --- |
| buffers | <code>Array</code> | <p>Array of Node Buffers output from a Docker container.</p> |


