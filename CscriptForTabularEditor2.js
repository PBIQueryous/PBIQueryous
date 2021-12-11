//C:\Users\ImranHaq\AppData\Local\TabularEditor
// m.Table.AddMeasure( "MeasureName", "Expression", m.DisplayFolder);
const string qt = "\"";
var latestMTDnofilt = "VAR _YtD = CALCULATE( MAX( Dates[LatestMTD] ) , REMOVEFILTERS ()) ";
var latestMTD = "VAR _YtD = CALCULATE( MAX( Dates[LatestMTD] ) /* , REMOVEFILTERS () */ ) ";
var cmlEndDate = "VAR _Max = CALCULATE( MAX( Dates[Date] ) /* , Dates[IsCFY] = TRUE */ )";
var cmlFYDate = "VAR _MaxFY = CALCULATE( MAX( Dates[Date] ) , Dates[IsCFY] = TRUE)";
var maxYTD1 = "VAR _YtD1 = CALCULATE( MAX( Dates[MTDAdd1] ) , Dates[IsCFY] = TRUE)";
var maxYTD2 = "VAR _YtD2 = CALCULATE( MAX( Dates[MTDAdd2] ) , Dates[IsCFY] = TRUE)";
var maxYTD3 = "VAR _YtD3 = CALCULATE( MAX( Dates[MTDAdd3] ) , Dates[IsCFY] = TRUE)";
var CalcResultYTD = "VAR _Result = CALCULATE ( " + m.DaxObjectName + ", " + '\n' + "KEEPFILTERS ( " + '\n' + dateColumn + "<= _YtD )) ";
var LessThanMax = + '\n' + dateColumn + "<= _Max ";
var LessThanYtD = + '\n' + dateColumn + "<= _Max ";  
var dateColumn = "Dates[Date]";
var mtdColumn = "Dates[LatestMTD]";
var endDate = "31/7";
var FYstring = qt + "31/7" + qt;
var endyrText = '\u0022' + endDate + '\u0022';
var mtdDate = "CALCULATE( MAX( Dates[LatestMTD] ) , REMOVEFILTERS ()) ";
var maxDate = "VAR _Max = CALCULATE( MAX( Dates[Date] ) , Dates[IsCFY] = TRUE)";
var GBP = qt + "£" + qt;
var Digits = "#,0";
var Percentage = "0.0 %";
var Decimal = "#,0.0";
var Number = "#,0";
var Currency = GBP + "#,0; -" + GBP + "#,0;" + GBP + "#,0";
var mMeasure = qt + "[MeasureName]" + qt;
var mActual = qt + "[Actual]" + qt;
var mPlan = qt + "[Plan]" + qt;

// Creates series of measures for every selected measure:
foreach(var m in Selected.Measures) {

    // EFY:
    m.Table.AddMeasure(
        // Name
        m.Name + " | EFY",
        // DAX expression
        '\n' + "VAR _YtD = CALCULATE( MAX( " + mtdColumn + " ), REMOVEFILTERS ())"
         + '\n' + "VAR _Result = CALCULATE ( " + m.DaxObjectName + ") " + '\n' + "RETURN" + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // CML:
    m.Table.AddMeasure(
        // Name
        m.Name + " | CML",
        // DAX expression
        '\n' + "VAR _YtD = CALCULATE( MAX( " + dateColumn + " ) , Dates[IsCFY] = TRUE)"
         + '\n' + "VAR _Result = CALCULATE ( " + m.DaxObjectName + ", " + '\n' + dateColumn + "<= _YtD ) "
         + '\n' + "RETURN" + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // YTD:
    m.Table.AddMeasure(
        // Name
        m.Name + " | YTD",
        // DAX expression
        '\n' + "VAR _YtD = CALCULATE( MAX( " + mtdColumn + " ), REMOVEFILTERS ())"
         + '\n' + "VAR _Result = CALCULATE ( " + m.DaxObjectName + ", " + '\n' + "KEEPFILTERS ( " + '\n' + dateColumn + "<= _YtD )) "
         + '\n' + "RETURN" + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // YTD CML:
    m.Table.AddMeasure(
        // Name
        m.Name + " | YTD CML",
        // DAX expression
        '\n' + "VAR _YtD = MAX( " + mtdColumn + " ) -- Last complete month"
         + '\n' + "VAR _Result = "
         + '\n' + "CALCULATE( " + m.DaxObjectName + ", " + '\n' + dateColumn + "<= _YtD ) "
         + '\n' + "RETURN"
         + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // REM:
    m.Table.AddMeasure(
        // Name
        m.Name + " | REM",
        // DAX expression
        '\n' + "VAR _YtD = CALCULATE( MAX( " + mtdColumn + " ) , REMOVEFILTERS ()) -- Last complete month"
         + '\n' + "VAR _Result = "
         + '\n' + "CALCULATE( " + m.DaxObjectName + ", " + '\n' + "KEEPFILTERS ( " + '\n' + dateColumn + ">= _YtD )) "
         + '\n' + "RETURN"
         + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // Actual & Forecast YTD:
    m.Table.AddMeasure(
        // Name
        "Actual & Forecast" + " | YTD",
        // DAX expression
        '\n' + "VAR _YtD = CALCULATE( MAX( " + mtdColumn + " ) , REMOVEFILTERS ()) -- Last complete month"
         + '\n' + "VAR _Actual = [Measure]"
         + '\n' + "VAR _Forecast = "
         + '\n' + "CALCULATE( " + m.DaxObjectName + ", " + '\n' + "KEEPFILTERS ( " + '\n' + dateColumn + ">= _YtD )) "
         + '\n' + "VAR _Result = _Actual + _Forecast"
         + '\n' + "RETURN"
         + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

    // Actual & Forecast CML:
    m.Table.AddMeasure(
        // Name
        "Actual & Forecast" + " | CML",
        // DAX expression
        '\n' + maxDate
         + '\n' + "VAR _Result = CALCULATE ( " + "[Actual & Forecast | YTD]" + ", " + '\n' + dateColumn + "<= _Max ) "
         + '\n' + "RETURN" + '\n' + "_Result",
        // Display Folder
        m.DisplayFolder);

}


/*  Cycle over all measures in model format using
    DAX Formatter with Short Lines, then add 1 line
    feed to the start of the measure */

FormatDax(Model.AllMeasures, true);
foreach (var m in Model.AllMeasures)
    {
        m.Expression = '\n' + m.Expression;
    }


/*  Cycle over all measures in model format
using DAX Formatter with Long Lines, 
then add 1 line feed to the start of the measure */

Model.AllMeasures.FormatDax();
foreach (var m in Model.AllMeasures)
    {
        m.Expression = '\n' + m.Expression ;
    }
	
	
/*Warning!  Take a backup copy first.  
This script will operate over every measure in the model. It is 
essential that your FromString and ToString are set to change only the
specific usage of the string that you need to change across the entire model.*/

var FromString = "Dates[Date]";
var ToString = "NewDates[Date]";

foreach (var m in Model.AllMeasures)
    {
        m.Expression = m.Expression.Replace(FromString,ToString);
        /* Cycle over all measures in model and replaces the 
           FromString with the ToString */
    }
	
	
var dateColumn = "NewDates[Date]";

// Creates time intelligence measures for every selected measure:
foreach(var m in Selected.Measures) {
    // Year-to-date:
    m.Table.AddMeasure(
        m.Name + " | YTD",                                       // Name
        "TOTALYTD(" + m.DaxObjectName + ", " + dateColumn + ")",     // DAX expression
        m.DisplayFolder                                        // Display Folder
    );
    
    // Previous year:
    m.Table.AddMeasure(
        m.Name + " | PY",                                       // Name
        "CALCULATE(" + m.DaxObjectName + ", SAMEPERIODLASTYEAR(" + dateColumn + "))",     // DAX expression
        m.DisplayFolder                                        // Display Folder
    );    
    
    // Year-over-year
    m.Table.AddMeasure(
    m.Name + " | YoY",                                       // Name
        m.DaxObjectName + " - [" + m.Name + " | PY]",            // DAX expression
        m.DisplayFolder                                        // Display Folder
    );
    
    // Year-over-year %:
    m.Table.AddMeasure(
    m.Name + " | YoY%",                                           // Name
    "DIVIDE(" + m.DaxObjectName + ", [" + m.Name + " | YoY])",    // DAX expression
        m.DisplayFolder                                             // Display Folder
    ).FormatString = "0.0 %";  // Set format string as percentage
    
    // Quarter-to-date:
    m.Table.AddMeasure(
    m.Name + " | QTD",                                            // Name
        "TOTALQTD(" + m.DaxObjectName + ", " + dateColumn + ")",    // DAX expression
        m.DisplayFolder                                             // Display Folder
    );
    
    // Month-to-date:
    m.Table.AddMeasure(
    m.Name + " | MTD",                                       // Name
        "TOTALMTD(" + m.DaxObjectName + ", " + dateColumn + ")",     // DAX expression
        m.DisplayFolder                                        // Display Folder
    );
}

var dateColumn = "Dates[Date]";
var mtdColumn = "Dates[LatestMTD]";
var endDate = "31/7";
var endyrText = '\u0022' + endDate + '\u0022';
var mtdDate = "CALCULATE( MAX( Dates[LatestMTD] ) , REMOVEFILTERS ()) ";
var maxDate = "VAR _Max = CALCULATE( MAX( Dates[Date] ) , Dates[IsCFY] = TRUE)";
var measure = "[MeasureName]";
// MeasureTemplate: Sophisticated Variance Column Chart:
foreach(var m in Selected.Measures) {
    
    // MinBar:
    m.Table.AddMeasure(
    // Name
    "MinBar", 
    // DAX expression
    '\n' + "VAR _Result = MIN( [ActualMin], [PlannedMin] )"
    + '\n' + "//if ActualMin less then ActualMin, if PlannedMin less then PlannedMin"  
    + '\n' + "RETURN" + '\n' + "_Result",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // MaxBar:
    m.Table.AddMeasure(
    // Name
    "MaxBar", 
    // DAX expression
    '\n' + "VAR _Result = MAX( [ActualMax], [PlannedMax] )"
    + '\n' + "//if ActualMax greater then ActualMax, if PlannedMax greater then PlannedMax"  
    + '\n' + "RETURN" + '\n' + "_Result",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // Above Planned:
    m.Table.AddMeasure(
    // Name
    "AbovePlan", 
    // DAX expression
    '\n' + "VAR _Actual = [ActualYTD]"
    + '\n' + "VAR _Plan = [PlannedYTD]"
    + '\n' + "RETURN" 
    + '\n' + "SWITCH ( TRUE (), _Actual >= _Plan, [MaxBar] - [MinBar] )",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // Below Planned:
    m.Table.AddMeasure(
    // Name
    "BelowPlan", 
    // DAX expression
    '\n' + "VAR _Actual = [ActualYTD]"
    + '\n' + "VAR _Plan = [PlannedYTD]"
    + '\n' + "RETURN" 
    + '\n' + "SWITCH ( TRUE (), _Plan > _Actual, [MaxBar] - [MinBar] )",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    
    
}


var dateColumn = "Dates[Date]";
var mtdColumn = "Dates[LatestMTD]";
var endDate = "31/7";
var endyrText = '\u0022' + endDate + '\u0022';
var mtdDate = "CALCULATE( MAX( Dates[LatestMTD] ) , REMOVEFILTERS ()) ";
var maxDate = "VAR _Max = CALCULATE( MAX( Dates[Date] ) , Dates[IsCFY] = TRUE)";
var measure = "[MeasureName]";
// MeasureTemplate: Sophisticated Variance Column Chart:
foreach(var m in Selected.Measures) {
    
    // DistinctCount:
    m.Table.AddMeasure(
    // Name
    "DistinctCount", 
    // DAX expression
    '\n' + "DISTINCTCOUNT( " + measure + " )",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // Sum:
    m.Table.AddMeasure(
    // Name
    "Sum", 
    // DAX expression
    '\n' + "SUM( " + measure + " )",          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // Calculate:
    m.Table.AddMeasure(
    // Name
    "Calculate", 
    // DAX expression
    '\n' + "CALCULATE( " + measure + " , " + "TableName[Column] = FilterCondition )" ,          
    // Display Folder
    m.DisplayFolder                                                     
    );
    
    // FirstNonBlank:
    m.Table.AddMeasure(
    // Name
    "FirstNonBlank", 
    // DAX expression
    '\n' + "SUMX ( DISTINCT ( Table[Column] ),"      
    + '\n' + "CALCULATE ( FIRSTNONBLANK (  Table[Column],  0 ),"
    + '\n' + "Table[Column] = FilterCondtion1,"
    + '\n' + "Measure = FilterCondtion2)"
    + '\n' + ")",
    // Display Folder
    m.DisplayFolder                                                     
    );
}



