static importConditions(serverManager, resourceName, selection = null)
{
	try
	{
		const resourceExtension = resourceName.split(".").pop();
		if (["csv", "odp", "xls", "xlsx"].indexOf(resourceExtension) > -1)
		{
			// (*) read conditions from resource:
			const resourceValue = serverManager.getResource(resourceName, true);

			// Conditionally use a `TextDecoder` to reprocess .csv type input,
			// which is then read in as a string
			const decodedResourceMaybe = new Uint8Array(resourceValue);
			// Could be set to 'buffer' for ASCII .csv
			const type = resourceExtension === "csv" ? "string" : "array";
			const decodedResource = type === "string" ? (new TextDecoder()).decode(decodedResourceMaybe) : decodedResourceMaybe;
			const workbook = XLSX.read(decodedResource, { type });

			// we consider only the first worksheet:
			if (workbook.SheetNames.length === 0)
			{
				throw "workbook should contain at least one worksheet";
			}
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];

			// worksheet to array of arrays (the first array contains the fields):
			const sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
			const fields = sheet.shift();

			// (*) select conditions:
			const selectedRows = (selection === null) ? sheet : util.selectFromArray(sheet, selection);

			// (*) return the selected conditions as an array of 'object as map':
			// [
			// {field0: value0-0, field1: value0-1, ...}
			// {field0: value1-0, field1: value1-1, ...}
			// ...
			// ]
			let trialList = new Array(selectedRows.length - 1);
			for (let r = 0; r < selectedRows.length; ++r)
			{
				let row = selectedRows[r];
				let trial = {};
				for (let l = 0; l < fields.length; ++l)
				{
					let value = row[l];

					// Look for string encoded arrays in the form of '[1, 2]'
					const arrayMaybe = util.turnSquareBracketsIntoArrays(value);

					if (Array.isArray(arrayMaybe))
					{
						// Keep the first match if more than one are found. If the
						// input string looked like '[1, 2][3, 4]' for example,
						// the resulting `value` would be [1, 2]. When `arrayMaybe` is
						// empty, `value` turns `undefined`.
						value = arrayMaybe;
					}

					if (typeof value === "string")
					{
						const numberMaybe = Number.parseFloat(value);

						// if value is a numerical string, convert it to a number:
						if (!isNaN(numberMaybe) && numberMaybe.toString().length === value.length)
						{
							value = numberMaybe;
						}
						else
						{
							// Parse doubly escaped line feeds
							value = value.replace(/(\n)/g, "\n");
						}
					}

					trial[fields[l]] = value;
				}
				trialList[r] = trial;
			}

			return trialList;
		}
		else
		{
			throw "extension: " + resourceExtension + " currently not supported.";
		}
	}
	catch (error)
	{
		throw {
			origin: "TrialHandler.importConditions",
			context: `when importing condition: ${resourceName}`,
			error,
		};
	}
}
