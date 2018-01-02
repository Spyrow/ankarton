# Ankarton

Ankama account's creator

*Ankarton can be used as an CommandLineApplication or a Library*

## Ankarton as a Command Line Application

### Installation

```
$ npm install -g ankarton
```

### Usage

```
$ ankarton --out <accountsFile> [options]
```
All accounts will be created in <accountsFile>

#### Options
**`--proxy <proxyfile> `**
Ankarton will use your file to retrieve proxies. 
Format of the proxyfile:
```
proxy1:ip
proxy2:ip
```


**`--total <total>`**
Number of account to create

## Ankarton as a Library

### Installation

```
$ npm install --save ankarton
```

### Usage

```
import Ankarton from 'ankarton'

Ankarton.generate({
    option1:value,
    ...
  });

```

### Example

```
import Ankarton from 'ankarton'

Ankarton.generate({
        proxy: { 
          host: <proxyHost>, 
          port: <proxyIp> },
        output: (err: any, data: any) => {
          console.log(data.login, data.password)
          resolve(data)
        },
        passwordGenerator: (guestLogin: string, guestPassword: string): string => {
          return "myPassword123"
        },
      });

```

### Options

**`proxyPath: string`**
Ankarton will read the file provided to find proxies

**`proxy: { host:string, ip:number }`**
Ankarton will use the proxy provided

**`total: number`**
Ankarton will create <total> accounts

**`output: (err: any, data: any)`**
Ankarton will send the result in the <output> callback

**`output: string`**
Ankarton will write the accounts in the <output> file

**`useOnlineProxy: boolean`**
Ankarton will use random online proxies is <useOnlineProxy> is `true`

**`passwordGenerator: (guestLogin: string, guestPassword: string)`**
Ankarton will can <passwordGenerator> to set the password of the account <guestLogin>:<guestPassword>


## Development

 * Prerequisites

   ```
   $ npm install
   ```

* Lint the ts files

    ```
    $ npm run lint
    ```
    or to fix some errors automatically
    ```
    $ npm run lint:fix
    ```  


* Build the js files

    ```
    $ npm run build
    ```  

## Contributing

All contributions are welcome! If you wish to contribute, please create an issue first so that your feature, problem or question can be discussed.

### Socials Links

- [Discord](https://discord.gg/swU74Fm)
