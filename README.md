# Redactie Navigation Module

## Setup

### Install dependencies

```
npm install
cd demo && npm install
```

### Run demo app

```bash
npm run build:demo
cd demo && npm run start
```

## Code snippets

### Validation
Multilanguage validation, based on a value of another, non-multilanguage field
```bash
position: MultilanguageYup.object().when('structurePosition', {
	is: 'limited', // selected structurePosition radiobutton value
	then: MultilanguageYup.object().validateMultiLanguage(
		languages,
		MultilanguageYup.array().test({
			name: 'limitedPosition',
			message: 'Gelieve een startpositie te selecteren',
			test: function(value) {
				if (!value) {
					return false;
				}
				return value.length > 0;
			},
		})
	),
}),
```
